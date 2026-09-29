import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';
import { provideHttpClient } from '@angular/common/http';

describe('adminGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should deny access and redirect to /forbidden if not logged in', () => {
    let navigatedTo: any = null;
    router.navigate = ((commands: any[]) => {
      navigatedTo = commands;
      return Promise.resolve(true);
    }) as any;

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).toBe(false);
    expect(navigatedTo).toEqual(['/forbidden']);
  });

  it('should deny access if logged in as customer', () => {
    let navigatedTo: any = null;
    router.navigate = ((commands: any[]) => {
      navigatedTo = commands;
      return Promise.resolve(true);
    }) as any;

    (authService as any).setSession({
      token: 'mock-customer-token',
      id: 2,
      username: 'cliente',
      email: 'cliente@gmail.com',
      fullName: 'Cliente de Prueba',
      role: 'ROLE_CUSTOMER'
    });

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).toBe(false);
    expect(navigatedTo).toEqual(['/forbidden']);
  });

  it('should allow access if logged in as admin', () => {
    (authService as any).setSession({
      token: 'mock-admin-token',
      id: 1,
      username: 'admin',
      email: 'admin@brasaswok.pe',
      fullName: 'Administrador Brasas & Wok',
      role: 'ROLE_ADMIN'
    });

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).toBe(true);
  });
});
