import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AccessService } from '../services/access/access.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AccessService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('/auth/login')) {
      return next.handle(request);
    }

    const token = this.authService.getToken();

    if (token) {
      request = this.addTokenToRequest(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          if (request.url.includes('/auth/refresh')) {
            this.authService.logout();
            this.router.navigate(['/login']);
          } else if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

           /* Try to refresh token
            return this.authService.refreshToken().pipe(
              switchMap((token: any) => {
                this.isRefreshing = false;
                this.refreshTokenSubject.next(token.access_token);
                return next.handle(this.addTokenToRequest(request, token.access_token));
              }),
              catchError((err) => {
                this.isRefreshing = false;
                this.authService.logout();
                this.router.navigate(['/login']);
                return throwError(() => err);
              }),
              finalize(() => {
                this.isRefreshing = false;
              })
            );
            */
          } else {
            return this.refreshTokenSubject.pipe(
              filter(token => token !== null),
              take(1),
              switchMap(token => {
                return next.handle(this.addTokenToRequest(request, token));
              })
            );
          }
        }
        return throwError(() => error);
      })
    );
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
