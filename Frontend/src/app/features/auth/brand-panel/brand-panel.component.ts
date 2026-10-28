import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Painel de apresentação das telas de autenticação: prancha com arte técnica,
 * assinatura do portal e selo de projeto.
 */
@Component({
  selector: 'app-brand-panel',
  host: { class: 'blueprint-grid' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './brand-panel.component.html',
  styleUrl: './brand-panel.component.scss',
})
export class BrandPanel {}
