/** Tipos do cartão de obra/projeto, compartilhados entre feed e módulos. */
export type ProjectCover = 'edificio' | 'galpao' | 'infra';

export interface FeaturedProject {
  name: string;
  client: string;
  location: string;
  scope: string;
  status: string;
  progress: number;
  cover: ProjectCover;
}
