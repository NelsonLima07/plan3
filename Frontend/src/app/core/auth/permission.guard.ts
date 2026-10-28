import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Bloqueia rotas que exigem uma permissão que o usuário logado não possui.
 * A permissão esperada vem de `route.data.permission` (ver `PERMISSIONS`).
 * Esconder o item do menu não basta: a URL direta também é validada aqui.
 */
export const permissionGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const required = route.data['permission'] as string | undefined;
  if (authService.hasPermission(required)) {
    return true;
  }

  const navId = route.data['navId'] as string | undefined;
  return router.createUrlTree(['/home'], {
    queryParams: navId ? { denied: navId } : { denied: 'area' },
  });
};
