import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'brasas_token';
  private readonly USER_KEY = 'brasas_user';

  private readonly _currentUser = signal<User | null>(this.getStoredUser());
  private readonly _token = signal<string | null>(this.getStoredToken());

  readonly currentUser = this._currentUser.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.role === 'ROLE_ADMIN');

  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
      }),
      catchError(error => {
        // Fallback for immediate UI test if backend is offline
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          const mockAdmin: AuthResponse = {
            token: 'mock-admin-token',
            type: 'Bearer',
            id: 1,
            username: 'admin',
            email: 'admin@brasaswok.pe',
            fullName: 'Administrador Brasas & Wok',
            role: 'ROLE_ADMIN'
          };
          this.setSession(mockAdmin);
          return of(mockAdmin);
        } else if (credentials.username === 'carlos_m' && credentials.password === 'cliente123') {
          const mockCustomer: AuthResponse = {
            token: 'mock-customer-token',
            type: 'Bearer',
            id: 2,
            username: 'carlos_m',
            email: 'carlos.m@gmail.com',
            fullName: 'Carlos Mendoza',
            role: 'ROLE_CUSTOMER'
          };
          this.setSession(mockCustomer);
          return of(mockCustomer);
        }
        return throwError(() => error);
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    const payload = {
      ...data,
      role: data.role || 'ROLE_CUSTOMER'
    };
    return this.http.post(`${this.apiUrl}/register`, payload).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this._token.set(null);
    this._currentUser.set(null);
  }

  private setSession(authResponse: AuthResponse): void {
    const user: User = {
      id: authResponse.id,
      username: authResponse.username,
      email: authResponse.email,
      fullName: authResponse.fullName,
      role: authResponse.role
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, authResponse.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    this._token.set(authResponse.token);
    this._currentUser.set(user);
  }

  private getStoredToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private getStoredUser(): User | null {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.USER_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  }
}
