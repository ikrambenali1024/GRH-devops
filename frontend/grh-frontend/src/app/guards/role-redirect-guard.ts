import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const roleRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const role = authService.getRole();

  if (role === 'EMPLOYEE') {
    router.navigate(['/app/my-space']);
    return false;
  }

  if (role === 'RH') {
    router.navigate(['/app/rh-dashboard']);
    return false;
  }

  return true;
};