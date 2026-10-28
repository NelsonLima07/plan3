/**
 * Conteúdo mock da página de divulgação (Home). Quando o backend/CMS estiver
 * disponível, basta trocar estas constantes por chamadas HTTP mantendo os tipos.
 */
import type { FeaturedProject } from '../../shared/project-card/project-card.model';

export interface FeedMetric {
  icon: string;
  value: string;
  label: string;
}

export interface FeedService {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

export type PostKind = 'obra' | 'empresa' | 'tecnico';

export interface FeedPost {
  id: number;
  date: string;
  author: string;
  role: string;
  kind: PostKind;
  title: string;
  body: string;
  tags: string[];
  likes: number;
  comments: number;
}

export interface Certification {
  label: string;
  description: string;
}

export interface Milestone {
  date: string;
  title: string;
  project: string;
  status: 'previsto' | 'em andamento' | 'concluído';
}

export interface QuickLink {
  icon: string;
  label: string;
  route: string;
}

export const FEED_METRICS: readonly FeedMetric[] = [
  { icon: 'apartment', value: '128', label: 'obras entregues' },
  { icon: 'straighten', value: '412 mil m²', label: 'área construída' },
  { icon: 'workspace_premium', value: '17 anos', label: 'de engenharia' },
  { icon: 'groups', value: '64', label: 'clientes ativos' },
];

export const FEED_SERVICES: readonly FeedService[] = [
  {
    icon: 'architecture',
    title: 'Projetos e estruturais',
    description:
      'Concepção arquitetônica, cálculo estrutural e detalhamento executivo com compatibilização de disciplinas.',
    tags: ['BIM', 'Estrutural'],
  },
  {
    icon: 'precision_manufacturing',
    title: 'Gerenciamento de obras',
    description:
      'Mobilização, controle de qualidade, segurança do trabalho e acompanhamento diário do canteiro.',
    tags: ['Canteiro', 'Qualidade'],
  },
  {
    icon: 'calculate',
    title: 'Orçamento e planejamento',
    description:
      'Composições próprias, curva ABC, cronograma físico-financeiro e controle de medições.',
    tags: ['Orçamento', 'Curva S'],
  },
  {
    icon: 'fact_check',
    title: 'Fiscalização e laudos',
    description:
      'Inspeções técnicas, laudos de estabilidade, ensaios e conformidade com as normas vigentes.',
    tags: ['Laudos', 'NBR'],
  },
  {
    icon: 'handyman',
    title: 'O&M — operação e manutenção',
    description:
      'Planos preventivos, ordens de serviço, indicadores de disponibilidade e gestão de ativos.',
    tags: ['Preventiva', 'Ativos'],
  },
  {
    icon: 'view_in_ar',
    title: 'BIM e gêmeo digital',
    description:
      'Modelos federados, clash detection, quantitativos automáticos e entrega do as built.',
    tags: ['IFC', 'As built'],
  },
];

export const FEATURED_PROJECTS: readonly FeaturedProject[] = [
  {
    name: 'Residencial Esmeralda',
    client: 'Construtora Vale Verde',
    location: 'Belo Horizonte · MG',
    scope: '18.400 m² · 12 pavimentos',
    status: 'Em execução',
    progress: 62,
    cover: 'edificio',
  },
  {
    name: 'Galpão Logístico Norte',
    client: 'TransLog Operações',
    location: 'Contagem · MG',
    scope: '9.800 m² · estrutura metálica',
    status: 'Concluída',
    progress: 100,
    cover: 'galpao',
  },
  {
    name: 'Viaduto Rio Seco',
    client: 'Prefeitura Municipal',
    location: 'Betim · MG',
    scope: '340 m · 6 vãos',
    status: 'Em projeto',
    progress: 18,
    cover: 'infra',
  },
];

export const FEED_POSTS: readonly FeedPost[] = [
  {
    id: 1,
    date: '12/10/2026',
    author: 'Equipe de Obras',
    role: 'Engenharia de produção',
    kind: 'obra',
    title: 'Residencial Esmeralda chega ao 8º pavimento dentro do prazo',
    body: 'A concretagem da laje do 8º pavimento foi concluída com 100% dos ensaios de resistência aprovados. O avanço físico acumulado alcançou 62% da obra, mantendo a curva prevista no cronograma contratual.',
    tags: ['obra', 'marco'],
    likes: 34,
    comments: 6,
  },
  {
    id: 2,
    date: '08/10/2026',
    author: 'Tecnologia',
    role: 'Produto e inovação',
    kind: 'empresa',
    title: 'Novo diário de obra digital entra em operação nos canteiros',
    body: 'Registro fotográfico, condições climáticas, efetivo e ocorrências agora são lançados direto do campo, com sincronização automática e relatório diário gerado ao fim do expediente.',
    tags: ['apps', 'campo'],
    likes: 27,
    comments: 4,
  },
  {
    id: 3,
    date: '02/10/2026',
    author: 'Fiscalização',
    role: 'Laudos e inspeções',
    kind: 'tecnico',
    title: 'Laudo de estabilidade concluído para o Galpão Logístico Norte',
    body: 'A inspeção periódica avaliou 100% dos pilares e ligações metálicas. Nenhuma anomalia estrutural foi identificada e o plano de manutenção preventiva foi renovado por 12 meses.',
    tags: ['laudo', 'O&M'],
    likes: 19,
    comments: 3,
  },
  {
    id: 4,
    date: '28/09/2026',
    author: 'Diretoria Técnica',
    role: 'Gestão de engenharia',
    kind: 'empresa',
    title: 'Processo BIM da empresa certificado em nível 2',
    body: 'A adoção de modelos federados em todos os projetos executivos reduziu em 31% o retrabalho por incompatibilidade entre disciplinas no último trimestre.',
    tags: ['BIM', 'processo'],
    likes: 41,
    comments: 9,
  },
];

export const CERTIFICATIONS: readonly Certification[] = [
  { label: 'ISO 9001', description: 'Sistema de gestão da qualidade' },
  { label: 'PBQP-H A', description: 'Qualificação no setor de obras' },
  { label: 'CREA-MG', description: 'Registro de pessoa jurídica ativo' },
  { label: 'BIM N2', description: 'Processo colaborativo certificado' },
];

export const MILESTONES: readonly Milestone[] = [
  {
    date: '22/10',
    title: 'Concretagem da laje do 9º pavimento',
    project: 'Residencial Esmeralda',
    status: 'previsto',
  },
  {
    date: '25/10',
    title: 'Medição nº 8 enviada ao cliente',
    project: 'Galpão Logístico Norte',
    status: 'em andamento',
  },
  {
    date: '01/11',
    title: 'Entrega do projeto executivo',
    project: 'Viaduto Rio Seco',
    status: 'previsto',
  },
  {
    date: '15/10',
    title: 'Renovação do plano de manutenção',
    project: 'Galpão Logístico Norte',
    status: 'concluído',
  },
];

export const QUICK_LINKS: readonly QuickLink[] = [
  { icon: 'groups', label: 'Consultar clientes', route: '/clientes' },
  { icon: 'request_quote', label: 'Acompanhar propostas', route: '/propostas' },
  { icon: 'construction', label: 'Cronograma das obras', route: '/obras' },
  { icon: 'handyman', label: 'Ordens de O&M', route: '/om' },
];
