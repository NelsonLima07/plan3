import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { InstitutionalFooter } from '../../layout/institutional-footer/institutional-footer.component';
import { ProjectCard } from '../../shared/project-card/project-card.component';
import { statusChipClass } from '../../shared/status-chip';
import { FeedHero } from './feed-hero/feed-hero.component';
import {
  CERTIFICATIONS,
  FEATURED_PROJECTS,
  FEED_POSTS,
  FEED_SERVICES,
  MILESTONES,
  QUICK_LINKS,
  type FeedPost,
} from './feed.data';

/**
 * Home do portal: página institucional que apresenta a empresa, as frentes de
 * serviço, as obras em destaque e o feed de novidades. Os dados são mockados em
 * `feed.data.ts`.
 */
@Component({
  selector: 'app-feed',
  imports: [RouterLink, FeedHero, InstitutionalFooter, ProjectCard, MatButtonModule, MatIconModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class Feed {
  private readonly authService = inject(AuthService);

  protected readonly user = this.authService.user;
  protected readonly services = FEED_SERVICES;
  protected readonly projects = FEATURED_PROJECTS;
  protected readonly posts = FEED_POSTS;
  protected readonly certifications = CERTIFICATIONS;
  protected readonly milestones = MILESTONES;
  protected readonly quickLinks = QUICK_LINKS;
  protected readonly statusChip = statusChipClass;

  protected readonly firstName = computed(() => this.user()?.name.split(' ')[0] ?? 'engenheiro');
  protected readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Bom dia';
    }
    return hour < 18 ? 'Boa tarde' : 'Boa noite';
  });

  protected readonly today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date());

  protected kindLabel(kind: FeedPost['kind']): string {
    switch (kind) {
      case 'obra':
        return 'Obra';
      case 'tecnico':
        return 'Técnico';
      default:
        return 'Empresa';
    }
  }

  protected initialsOf(name: string): string {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
    return (first + last).toUpperCase();
  }
}
