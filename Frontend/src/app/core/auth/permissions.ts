/**
 * Permissões do portal. Cada área do sistema declara a permissão necessária
 * para ser vista no menu e acessada pela URL. O backend, quando existir, deve
 * devolver a mesma lista em `AuthUser.permissions`.
 */
export const PERMISSIONS = {
  dashboard: 'dashboard:view',
  clientes: 'clientes:view',
  propostas: 'propostas:view',
  projetos: 'projetos:view',
  obras: 'obras:view',
  om: 'om:view',
  apps: 'apps:view',
  configuracoes: 'config:manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** Coringa concedido a administradores: libera qualquer permissão. */
export const WILDCARD_PERMISSION = '*';
