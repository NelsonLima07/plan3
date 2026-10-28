import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { PERMISSIONS } from './core/auth/permissions';
import { permissionGuard } from './core/auth/permission.guard';

/**
 * Módulos que ainda não foram construídos compartilham a mesma tela padrão; o
 * conteúdo (ícone, título, descrição e escopo) vem de `data` em cada rota.
 */
const featurePlaceholder = () =>
  import('./shared/feature-placeholder/feature-placeholder.component').then(
    (m) => m.FeaturePlaceholder,
  );

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar · Portal de Engenharia',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/portal-shell/portal-shell.component').then((m) => m.PortalShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
        title: 'Home · Portal de Engenharia',
        loadComponent: () => import('./features/feed/feed.component').then((m) => m.Feed),
        data: { navId: 'home' },
      },
      {
        path: 'dashboard',
        title: 'Dashboard · Portal de Engenharia',
        canActivate: [permissionGuard],
        loadComponent: featurePlaceholder,
        data: {
          navId: 'dashboard',
          permission: PERMISSIONS.dashboard,
          icon: 'dashboard',
          eyebrow: 'Indicadores',
          title: 'Dashboard',
          description:
            'Painel consolidado da carteira: avanço físico e financeiro, prazos, desvios de cronograma e indicadores de produtividade por obra.',
          highlights: [
            'Avanço físico e financeiro por obra e por contrato',
            'Curva S prevista versus realizada',
            'Alertas de marcos contratuais em risco',
            'Produtividade por equipe e por frente de serviço',
          ],
        },
      },
      {
        path: 'clientes',
        title: 'Clientes · Portal de Engenharia',
        canActivate: [permissionGuard],
        loadComponent: featurePlaceholder,
        data: {
          navId: 'clientes',
          permission: PERMISSIONS.clientes,
          icon: 'groups',
          eyebrow: 'Comercial e relacionamento',
          title: 'Clientes',
          description:
            'Cadastro único de clientes, contatos, documentos e histórico de relacionamento com a engenharia.',
          highlights: [
            'Cadastro de pessoa física e jurídica com dados fiscais',
            'Contatos por obra e canal preferencial de comunicação',
            'Histórico de contratos, propostas e medições',
            'Documentos, procurações e certidões anexados',
          ],
        },
      },
      {
        path: 'propostas',
        title: 'Propostas · Portal de Engenharia',
        canActivate: [permissionGuard],
        loadComponent: featurePlaceholder,
        data: {
          navId: 'propostas',
          permission: PERMISSIONS.propostas,
          icon: 'request_quote',
          eyebrow: 'Comercial',
          title: 'Propostas',
          description:
            'Orçamentos com composições próprias, revisões controladas e acompanhamento do follow-up comercial até o fechamento.',
          highlights: [
            'Composições, insumos e curva ABC da proposta',
            'Versões e revisões com registro de responsável técnico',
            'Follow-up comercial com etapas e próximos passos',
            'Conversão de proposta aceita em contrato e obra',
          ],
        },
      },
      {
        path: 'projetos',
        title: 'Projetos · Portal de Engenharia',
        canActivate: [permissionGuard],
        loadComponent: featurePlaceholder,
        data: {
          navId: 'projetos',
          permission: PERMISSIONS.projetos,
          icon: 'architecture',
          eyebrow: 'Engenharia de projetos',
          title: 'Projetos',
          description:
            'Gestão da documentação técnica: disciplinas, revisões, aprovações e entrega do as built.',
          highlights: [
            'Controle de revisões por disciplina e prancha',
            'Fluxo de aprovação do cliente e órgãos competentes',
            'Compatibilização e clash detection (BIM)',
            'Entrega do as built e manual do proprietário',
          ],
        },
      },
      {
        path: 'obras',
        title: 'Obras · Portal de Engenharia',
        canActivate: [permissionGuard],
        loadComponent: featurePlaceholder,
        data: {
          navId: 'obras',
          permission: PERMISSIONS.obras,
          icon: 'construction',
          eyebrow: 'Execução',
          title: 'Obras',
          description:
            'Acompanhamento da execução: cronograma físico-financeiro, medições, diário de obra e ocorrências do canteiro.',
          highlights: [
            'Cronograma físico-financeiro e marcos contratuais',
            'Medições, boletins e faturamento por etapa',
            'Diário de obra com fotos, clima e efetivo',
            'Ocorrências, não conformidades e plano de ação',
          ],
        },
      },
      {
        path: 'om',
        title: 'O&M · Portal de Engenharia',
        canActivate: [permissionGuard],
        loadComponent: featurePlaceholder,
        data: {
          navId: 'om',
          permission: PERMISSIONS.om,
          icon: 'handyman',
          eyebrow: 'Operação e manutenção',
          title: 'O&M',
          description:
            'Planos de manutenção preventiva, ordens de serviço, gestão de ativos e indicadores de disponibilidade.',
          highlights: [
            'Planos preventivos por sistema e periodicidade',
            'Ordens de serviço com checklist e evidências',
            'Cadastro de ativos e vida útil estimada',
            'Indicadores de disponibilidade e custo de manutenção',
          ],
        },
      },
      {
        path: 'apps',
        title: 'Apps · Portal de Engenharia',
        canActivate: [permissionGuard],
        loadComponent: featurePlaceholder,
        data: {
          navId: 'apps',
          permission: PERMISSIONS.apps,
          icon: 'apps',
          eyebrow: 'Ferramentas',
          title: 'Apps',
          description:
            'Aplicativos internos e integrações do portal: medidores, conversores, diário de campo e conectores.',
          highlights: [
            'Diário de obra digital para uso em campo',
            'Calculadoras estruturais e conversores de unidades',
            'Integrações com ERP, BIM e assinatura digital',
            'Painéis e relatórios exportáveis',
          ],
        },
      },
      {
        path: 'configuracoes',
        title: 'Configurações · Portal de Engenharia',
        canActivate: [permissionGuard],
        loadComponent: featurePlaceholder,
        data: {
          navId: 'configuracoes',
          permission: PERMISSIONS.configuracoes,
          icon: 'settings',
          eyebrow: 'Administração',
          title: 'Configurações',
          description:
            'Área administrativa: usuários, perfis de permissão, parâmetros do portal e preferências da empresa.',
          highlights: [
            'Usuários e perfis de acesso por módulo',
            'Parâmetros de medição, unidades e numeração',
            'Modelos de documentos e assinaturas',
            'Auditoria de acessos e alterações',
          ],
        },
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
