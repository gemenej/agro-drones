// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

interface User {
  id: number;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'auth_user';
  private readonly API_URL = 'http://localhost:3000/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );
  private currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.setUser(response.user);
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/logout`, {}).pipe(
      catchError((error) => {
        console.error('Logout error:', error);
        return [];
      }),
      tap(() => this.handleLogout(true))
    );
  }

  signup(
    email: string,
    password: string,
    name: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/signup`, {
        email,
        password,
        name,
      })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.setUser(response.user);
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  private handleLogout(clearUserData: boolean = false): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);

    if (clearUserData) {
      localStorage.removeItem(this.USER_KEY);
      this.currentUserSubject.next(null);
    }

    this.router.navigate(['/auth/login']);
  }

  forceLogout(): void {
    this.handleLogout(true);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    // post method to refresh token with refresh token and userId
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/refresh`, {
        refresh_token: refreshToken,
        userId: this.getStoredUser()._id
      })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.setUser(response.user);
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  private setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    if (user === undefined || user === null) {
      return null;
    }
    try {
      return JSON.parse(user);
    } catch (e) {
      console.error('Error parsing JSON from localStorage', e);
      return null;
    }
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
