import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { NavGroup } from '../../core/navigation/navigation.model';
import { NavigationService } from '../../core/navigation/navigation.service';
import { FeedbackService } from '../../core/ui/feedback.service';
import { UserMenu } from '../user-menu/user-menu.component';

/**
 * Moldura do portal: menu lateral dinâmico (montado a partir das permissões do
 * usuário), barra superior com identificação da página e área de conteúdo.
 */
@Component({
  selector: 'app-portal-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    UserMenu,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  templateUrl: './portal-shell.component.html',
  styleUrl: './portal-shell.component.scss',
})
export class PortalShell {
  private readonly authService = inject(AuthService);
  private readonly navigation = inject(NavigationService);
  private readonly feedback = inject(FeedbackService);
  private readonly router = inject(Router);
  private readonly breakpoints = inject(BreakpointObserver);

  protected readonly user = this.authService.user;
  protected readonly appVersion = 'v0.1';

  protected readonly isHandset = toSignal(
    this.breakpoints.observe('(max-width: 1023.98px)').pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly activeItem = computed(() => this.navigation.itemForUrl(this.currentUrl()));
  protected readonly pageTitle = computed(() => this.activeItem()?.label ?? 'Portal de Engenharia');
  protected readonly pageEyebrow = computed(() => {
    const item = this.activeItem();
    return item ? this.navigation.groupLabelFor(item.id) : undefined;
  });

  protected readonly menuQuery = signal('');
  protected readonly menuGroups = computed<NavGroup[]>(() =>
    filterGroups(this.navigation.groups(), this.menuQuery()),
  );

  /** Contêiner rolável do conteúdo (a janela não rola nesta moldura). */
  private readonly contentRef = viewChild('contentRef', { read: ElementRef });

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.scrollContentToTop();
        this.notifyDeniedAccess();
      });
  }

  protected onMenuQuery(event: Event): void {
    this.menuQuery.set((event.target as HTMLInputElement).value);
  }

  protected closeOnNavigate(sidenav: MatSidenav): void {
    if (this.isHandset() && sidenav.opened) {
      void sidenav.close();
    }
  }

  protected notifySoon(feature: string): void {
    this.feedback.comingSoon(feature);
  }

  /** A moldura não rola na janela: o topo é restaurado no contêiner interno. */
  private scrollContentToTop(): void {
    const element = this.contentRef()?.nativeElement as HTMLElement | undefined;
    element?.scrollTo({ top: 0 });
  }

  /** Avisa quando o usuário tentou abrir uma área sem permissão. */
  private notifyDeniedAccess(): void {
    const denied = this.router.parseUrl(this.router.url).queryParamMap.get('denied');
    if (!denied) {
      return;
    }

    const label = this.navigation.labelFor(denied);
    this.feedback.warn(
      label
        ? `Acesso restrito: "${label}" não está liberado para o seu perfil.`
        : 'Acesso restrito para o seu perfil.',
    );
  }
}

/** Filtra os grupos/itens do menu pelo texto digitado na busca. */
function filterGroups(groups: NavGroup[], query: string): NavGroup[] {
  const term = normalize(query);
  if (!term) {
    return groups;
  }

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          normalize(item.label).includes(term) || normalize(item.description ?? '').includes(term),
      ),
    }))
    .filter((group) => group.items.length > 0);
}

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
