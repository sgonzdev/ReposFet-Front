import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Access, AccessResult, Me } from '../../interface/access';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly baseUrl = environment.apiUrl + '/auth';
  private currentUserSubject: BehaviorSubject<Me | null>;
  public currentUser: Observable<Me | null>;
  private jwtHelper = new JwtHelperService();

  constructor(
    private readonly http: HttpClient,
    private router: Router
  ) {
    const storedUser = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<Me | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(datos: Access): Observable<AccessResult> {
    return this.http.post<AccessResult>(`${this.baseUrl}/login`, datos)
      .pipe(
        tap(response => {
          if (response && response.access_token) {
            this.storeToken(response.access_token);
            this.loadUserFromToken(response.access_token);
          }
        })
      );
  }

  /*
  refreshToken(): Observable<any> {
    return this.http.post<AccessResult>(`${this.baseUrl}/refresh`, {})
      .pipe(
        tap(response => {
          if (response && response.access_token) {
            this.storeToken(response.access_token);
            this.loadUserFromToken(response.access_token);
          }
        })
      );
  }
  */

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {})
      .pipe(
        tap(() => {
          this.clearStorage();
          this.currentUserSubject.next(null);
        })
      );
  }

  localLogout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  hasPermission(permission: string): boolean {
    const userProfile = this.getCurrentUser();
    if (!userProfile || !Array.isArray(userProfile.permissions)) {
      return false;
    }
    return userProfile.permissions.includes(permission);
  }

  hasRole(role: string): boolean {
    const userProfile = this.getCurrentUser();
    if (!userProfile || !Array.isArray(userProfile.roles)) {
      return false;
    }
    return userProfile.roles.includes(role);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private getStoredUser(): Me | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) as Me : null;
  }

  private storeUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private loadUserFromToken(token: string): void {
    this.getUserProfile().subscribe(
      userProfile => {
        this.storeUser(userProfile);
        this.currentUserSubject.next(userProfile);
      },
      error => {
        console.error('Error loading user profile', error);
      }
    );
  }


  getUserProfile(): Observable<Me> {
    return this.http.get<{ status: string; data: Me }>(`${this.baseUrl}/me`).pipe(
      map(response => {
        if (response.status === 'success') {
          return response.data;
        }
        throw new Error('Failed to get user profile');
      })
    );
  }
}
