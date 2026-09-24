import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest, RegisterRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop Overlay -->
      <div
        class="fixed inset-0 bg-brand-secondary/70 backdrop-blur-sm transition-opacity"
        (click)="close()"
        aria-hidden="true"
      ></div>

      <!-- Modal Card -->
      <div
        class="relative w-full max-w-md bg-brand-surface rounded-2xl shadow-dropdown border border-brand-border overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <!-- Modal Header -->
        <div class="p-6 pb-4 border-b border-brand-border flex items-center justify-between bg-brand-surface-alt/40">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <app-icon name="flame" [size]="18"></app-icon>
            </div>
            <div>
              <h3 id="modal-title" class="text-base font-bold text-brand-text-primary font-sans">
                {{ activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta' }}
              </h3>
              <p class="text-xs text-brand-text-secondary">Brasas a Wok • Acceso Delivery</p>
            </div>
          </div>

          <button
            type="button"
            (click)="close()"
            class="p-1.5 text-brand-text-muted hover:text-brand-text-primary hover:bg-brand-surface-alt rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <app-icon name="x" [size]="18"></app-icon>
          </button>
        </div>

        <!-- Segmented Tab Switcher -->
        <div class="p-6 pt-4 pb-0">
          <div class="flex bg-brand-surface-alt p-1 rounded-xl border border-brand-border text-xs font-semibold">
            <button
              type="button"
              (click)="activeTab = 'login'; errorMessage = ''; successMessage = ''"
              [class.bg-brand-surface]="activeTab === 'login'"
              [class.text-brand-text-primary]="activeTab === 'login'"
              [class.shadow-subtle]="activeTab === 'login'"
              [class.text-brand-text-secondary]="activeTab !== 'login'"
              class="flex-1 py-2 rounded-lg transition-all"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              (click)="activeTab = 'register'; errorMessage = ''; successMessage = ''"
              [class.bg-brand-surface]="activeTab === 'register'"
              [class.text-brand-text-primary]="activeTab === 'register'"
              [class.shadow-subtle]="activeTab === 'register'"
              [class.text-brand-text-secondary]="activeTab !== 'register'"
              class="flex-1 py-2 rounded-lg transition-all"
            >
              Registrarse
            </button>
          </div>
        </div>

        <!-- Alerts -->
        <div class="px-6 pt-4" *ngIf="errorMessage">
          <div class="p-3 rounded-lg bg-brand-status-error-bg border border-brand-status-error/20 text-brand-status-error text-xs flex items-center gap-2">
            <app-icon name="alert" [size]="16" customClass="shrink-0"></app-icon>
            <span>{{ errorMessage }}</span>
          </div>
        </div>

        <div class="px-6 pt-4" *ngIf="successMessage">
          <div class="p-3 rounded-lg bg-brand-status-success-bg border border-brand-status-success/20 text-brand-status-success text-xs flex items-center gap-2">
            <app-icon name="check" [size]="16" customClass="shrink-0"></app-icon>
            <span>{{ successMessage }}</span>
          </div>
        </div>

        <!-- Tab 1: Login Form -->
        <form *ngIf="activeTab === 'login'" (ngSubmit)="handleLogin()" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-brand-text-primary mb-1.5">Usuario o Correo</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-text-muted">
                <app-icon name="user" [size]="16"></app-icon>
              </span>
              <input
                type="text"
                [(ngModel)]="loginForm.username"
                name="username"
                required
                placeholder="ej: carlos_m o admin"
                class="w-full pl-9 pr-3 py-2 text-xs bg-brand-surface-alt border border-brand-border rounded-lg text-brand-text-primary placeholder-brand-text-muted focus:bg-brand-surface focus:border-brand-primary"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-brand-text-primary mb-1.5">Contraseña</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-text-muted">
                <app-icon name="lock" [size]="16"></app-icon>
              </span>
              <input
                type="password"
                [(ngModel)]="loginForm.password"
                name="password"
                required
                placeholder="••••••••"
                class="w-full pl-9 pr-3 py-2 text-xs bg-brand-surface-alt border border-brand-border rounded-lg text-brand-text-primary placeholder-brand-text-muted focus:bg-brand-surface focus:border-brand-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            [disabled]="isLoading || !loginForm.username || !loginForm.password"
            class="w-full py-2.5 px-4 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-card transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {{ isLoading ? 'Ingresando...' : 'Iniciar Sesión' }}
          </button>

          <!-- Quick Test Credentials Hint -->
          <div class="p-3 rounded-lg bg-brand-surface-alt text-[11px] text-brand-text-secondary border border-brand-border space-y-1">
            <span class="font-bold text-brand-text-primary block">Credenciales de prueba:</span>
            <p>• Cliente: <span class="font-mono text-brand-primary font-semibold">carlos_m</span> / <span class="font-mono">cliente123</span></p>
            <p>• Admin: <span class="font-mono text-brand-primary font-semibold">admin</span> / <span class="font-mono">admin123</span></p>
          </div>
        </form>

        <!-- Tab 2: Register Form -->
        <form *ngIf="activeTab === 'register'" (ngSubmit)="handleRegister()" class="p-6 space-y-3">
          <div>
            <label class="block text-xs font-semibold text-brand-text-primary mb-1">Nombre Completo</label>
            <input
              type="text"
              [(ngModel)]="registerForm.fullName"
              name="fullName"
              required
              placeholder="Carlos Mendoza"
              class="w-full px-3 py-1.5 text-xs bg-brand-surface-alt border border-brand-border rounded-lg text-brand-text-primary focus:bg-brand-surface focus:border-brand-primary"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-brand-text-primary mb-1">Usuario</label>
              <input
                type="text"
                [(ngModel)]="registerForm.username"
                name="regUsername"
                required
                placeholder="carlos_m"
                class="w-full px-3 py-1.5 text-xs bg-brand-surface-alt border border-brand-border rounded-lg text-brand-text-primary focus:bg-brand-surface focus:border-brand-primary"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-brand-text-primary mb-1">Celular</label>
              <input
                type="tel"
                [(ngModel)]="registerForm.phone"
                name="phone"
                placeholder="991234567"
                class="w-full px-3 py-1.5 text-xs bg-brand-surface-alt border border-brand-border rounded-lg text-brand-text-primary focus:bg-brand-surface focus:border-brand-primary"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-brand-text-primary mb-1">Correo Electrónico</label>
            <input
              type="email"
              [(ngModel)]="registerForm.email"
              name="email"
              required
              placeholder="carlos.m@gmail.com"
              class="w-full px-3 py-1.5 text-xs bg-brand-surface-alt border border-brand-border rounded-lg text-brand-text-primary focus:bg-brand-surface focus:border-brand-primary"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-brand-text-primary mb-1">Dirección de Entrega</label>
            <input
              type="text"
              [(ngModel)]="registerForm.address"
              name="address"
              placeholder="Calle Los Pinos 432, San Isidro"
              class="w-full px-3 py-1.5 text-xs bg-brand-surface-alt border border-brand-border rounded-lg text-brand-text-primary focus:bg-brand-surface focus:border-brand-primary"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-brand-text-primary mb-1">Contraseña</label>
            <input
              type="password"
              [(ngModel)]="registerForm.password"
              name="regPassword"
              required
              placeholder="Mínimo 6 caracteres"
              class="w-full px-3 py-1.5 text-xs bg-brand-surface-alt border border-brand-border rounded-lg text-brand-text-primary focus:bg-brand-surface focus:border-brand-primary"
            />
          </div>

          <button
            type="submit"
            [disabled]="isLoading || !registerForm.username || !registerForm.email || !registerForm.password || !registerForm.fullName"
            class="w-full mt-2 py-2.5 px-4 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-card transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta y Pedir' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class AuthModalComponent {
  @Output() closeEvent = new EventEmitter<void>();

  activeTab: 'login' | 'register' = 'login';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  loginForm: LoginRequest = {
    username: '',
    password: ''
  };

  registerForm: RegisterRequest = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  };

  constructor(private readonly authService: AuthService) {}

  handleLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.loginForm).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.successMessage = `¡Bienvenido(a), ${user.fullName}!`;
        setTimeout(() => {
          this.close();
        }, 800);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Usuario o contraseña incorrectos. Verifica tus datos.';
      }
    });
  }

  handleRegister(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerForm).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = '¡Cuenta creada con éxito! Iniciando sesión...';
        this.authService.login({
          username: this.registerForm.username,
          password: this.registerForm.password
        }).subscribe({
          next: () => {
            setTimeout(() => {
              this.close();
            }, 800);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Error al registrar la cuenta. El usuario o correo ya podría existir.';
      }
    });
  }

  close(): void {
    this.closeEvent.emit();
  }
}
