import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { statusChipClass } from '../status-chip';
import { FeaturedProject } from './project-card.model';

/**
 * Cartão de obra/projeto com miniatura técnica desenhada em SVG, dados do
 * contrato e avanço físico. Reutilizável nas páginas de Obras e Projetos.
 */
@Component({
  selector: 'app-project-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCard {
  readonly project = input.required<FeaturedProject>();

  protected readonly statusChip = statusChipClass;
}
