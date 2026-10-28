import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Protege rotas do portal e devolve o usuário ao login guardando o destino. */
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  const redirect = state.url && state.url !== '/' ? { redirect: state.url } : undefined;
  return router.createUrlTree(['/login'], { queryParams: redirect });
};
