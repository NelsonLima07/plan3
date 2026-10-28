import { Injectable, computed, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { PERMISSIONS } from '../auth/permissions';
import { NavGroup, NavItem } from './navigation.model';

/**
 * Fonte única da verdade do menu lateral. A visibilidade é derivada das
 * permissões do usuário logado, então o menu se reconstrói automaticamente
 * a cada troca de sessão (sinais).
 */
const NAV_GROUPS: readonly NavGroup[] = [
  {
    id: 'operacao',
    label: 'Operação',
    items: [
      {
        id: 'home',
        label: 'Home',
        icon: 'home',
        route: '/home',
        group: 'operacao',
        description: 'Divulgação da empresa e novidades do portal.',
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        route: '/dashboard',
        group: 'operacao',
        permission: PERMISSIONS.dashboard,
        description: 'Indicadores de carteira, prazos e execução.',
      },
      {
        id: 'clientes',
        label: 'Clientes',
        icon: 'groups',
        route: '/clientes',
        group: 'operacao',
        permission: PERMISSIONS.clientes,
        description: 'Cadastro, contatos e histórico de relacionamento.',
      },
      {
        id: 'propostas',
        label: 'Propostas',
        icon: 'request_quote',
        route: '/propostas',
        group: 'operacao',
        permission: PERMISSIONS.propostas,
        description: 'Orçamentos, composições e follow-up comercial.',
      },
      {
        id: 'projetos',
        label: 'Projetos',
        icon: 'architecture',
        route: '/projetos',
        group: 'operacao',
        permission: PERMISSIONS.projetos,
        description: 'Documentação técnica, revisões e aprovações.',
      },
      {
        id: 'obras',
        label: 'Obras',
        icon: 'construction',
        route: '/obras',
        group: 'operacao',
        permission: PERMISSIONS.obras,
        description: 'Cronograma físico-financeiro, medições e diário de obra.',
      },
      {
        id: 'om',
        label: 'O&M',
        icon: 'handyman',
        route: '/om',
        group: 'operacao',
        permission: PERMISSIONS.om,
        description: 'Operação e manutenção: planos, ordens e ativos.',
      },
    ],
  },
  {
    id: 'ferramentas',
    label: 'Ferramentas',
    items: [
      {
        id: 'apps',
        label: 'Apps',
        icon: 'apps',
        route: '/apps',
        group: 'ferramentas',
        permission: PERMISSIONS.apps,
        description: 'Aplicativos e integrações do portal.',
      },
    ],
  },
  {
    id: 'administracao',
    label: 'Administração',
    items: [
      {
        id: 'configuracoes',
        label: 'Configurações',
        icon: 'settings',
        route: '/configuracoes',
        group: 'administracao',
        permission: PERMISSIONS.configuracoes,
        description: 'Usuários, permissões e parâmetros do portal.',
      },
    ],
  },
];

const ALL_ITEMS: readonly NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly authService = inject(AuthService);

  /** Grupos visíveis para o usuário logado (grupos vazios são removidos). */
  readonly groups = computed<NavGroup[]>(() =>
    NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => this.authService.hasPermission(item.permission)),
    })).filter((group) => group.items.length > 0),
  );

  /** Todos os itens visíveis, em ordem de exibição. */
  readonly items = computed<NavItem[]>(() => this.groups().flatMap((group) => group.items));

  itemFor(id: string): NavItem | undefined {
    return ALL_ITEMS.find((item) => item.id === id);
  }

  labelFor(id: string): string | undefined {
    return this.itemFor(id)?.label;
  }

  groupLabelFor(id: string): string | undefined {
    return NAV_GROUPS.find((group) => group.items.some((item) => item.id === id))?.label;
  }

  /** Item correspondente à URL atual (maior prefixo que casa). */
  itemForUrl(url: string): NavItem | undefined {
    const path = url.split('?')[0].replace(/\/+$/, '') || '/';
    return this.items()
      .filter((item) => path === item.route || path.startsWith(`${item.route}/`))
      .sort((a, b) => b.route.length - a.route.length)[0];
  }
}
