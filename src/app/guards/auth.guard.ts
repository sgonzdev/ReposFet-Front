import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
  CanLoad,
  Route
} from '@angular/router';
import { AccessService } from '../services/access/access.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private authService: AccessService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkAuthentication(route, state.url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    const url = route.path ? `/${route.path}` : '/';
    return this.checkAuthentication(route, url);
  }

 private checkAuthentication(route: ActivatedRouteSnapshot | Route, url: string): boolean {
  if (this.authService.isLoggedIn()) {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredPermissions = route.data?.['permissions'] as string[];
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.some(permission =>
        this.authService.hasPermission(permission)
      );

      if (!hasPermission) {
        this.router.navigate(['/forbidden']);
        return false;
      }
    }

    const requiredRoles = route.data?.['roles'] as string[];
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.some(role =>
        this.authService.hasRole(role)
      );

      if (!hasRole) {
        this.router.navigate(['/forbidden']);
        return false;
      }
    }

    return true;
  }

  this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
  return false;
}
}
