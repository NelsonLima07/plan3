/** Seções do menu lateral (subtítulos exibidos no sidenav). */
export type NavGroupId = 'operacao' | 'ferramentas' | 'administracao';

export interface NavItem {
  /** Identificador estável, também usado como `route.data.navId`. */
  id: string;
  label: string;
  /** Ligadura dos Material Symbols. */
  icon: string;
  route: string;
  /** Permissão necessária; ausente = visível para todos os usuários logados. */
  permission?: string;
  group: NavGroupId;
  /** Texto curto exibido no tooltip/título da página. */
  description?: string;
  /** Selo opcional à direita do item (ex.: "novo"). */
  badge?: string;
}

export interface NavGroup {
  id: NavGroupId;
  label: string;
  items: NavItem[];
}
