import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'brasas_token';
  private readonly USER_KEY = 'brasas_user';
  private readonly toastService = inject(ToastService);

  private readonly _currentUser = signal<User | null>(this.getStoredUser());
  private readonly _token = signal<string | null>(this.getStoredToken());

  readonly currentUser = this._currentUser.asReadonly();
  readonly token = this._token.asReadonly();
  // verifica si hay usuario autenticado
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  // verifica rol administrador
  readonly isAdmin = computed(() => this._currentUser()?.role === 'ROLE_ADMIN');
  // verifica rol cliente
  readonly isCustomer = computed(() => this._currentUser()?.role === 'ROLE_CUSTOMER');

  constructor(private readonly http: HttpClient) {}

  // inicia sesion con credenciales
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  // registra nuevo cliente
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

  // obtiene usuario actual
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  // cierra sesion activa
  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this._token.set(null);
    this._currentUser.set(null);
    this.toastService.info('Has cerrado sesión correctamente.');
  }

  // guarda sesion en storage local
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
