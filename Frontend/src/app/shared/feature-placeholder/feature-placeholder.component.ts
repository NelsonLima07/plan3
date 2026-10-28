import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';

/** Dados declarados em `route.data` para cada módulo ainda em construção. */
interface PlaceholderData {
  icon?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  highlights?: string[];
}

/**
 * Tela padrão dos módulos que ainda serão construídos. O conteúdo vem da
 * configuração da rota (`data`), então as 8 seções do menu reutilizam este
 * componente sem duplicar arquivos.
 */
@Component({
  selector: 'app-feature-placeholder',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './feature-placeholder.component.html',
  styleUrl: './feature-placeholder.component.scss',
})
export class FeaturePlaceholder {
  private readonly data = inject(ActivatedRoute).snapshot.data as PlaceholderData;

  protected readonly icon = this.data.icon ?? 'engineering';
  protected readonly eyebrow = this.data.eyebrow ?? 'Módulo do portal';
  protected readonly title = this.data.title ?? 'Módulo em construção';
  protected readonly description = this.data.description ?? '';
  protected readonly highlights = this.data.highlights ?? [];
}
