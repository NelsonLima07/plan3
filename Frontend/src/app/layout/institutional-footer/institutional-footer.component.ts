import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Rodapé institucional reutilizado pelas páginas do portal. */
@Component({
  selector: 'app-institutional-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './institutional-footer.component.html',
  styleUrl: './institutional-footer.component.scss',
})
export class InstitutionalFooter {}
