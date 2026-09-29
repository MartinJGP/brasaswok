import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AuthService } from '../../../core/services/auth.service';
import { AuthModalComponent } from '../../../shared/components/auth-modal/auth-modal.component';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, AuthModalComponent],
  template: `
    <div class="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-brand-surface rounded-3xl border border-brand-border p-8 sm:p-10 shadow-card text-center space-y-6">
        <div class="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center shadow-subtle border border-amber-500/20">
          <app-icon name="lock" [size]="30"></app-icon>
        </div>

        <div class="space-y-2">
          <span class="text-4xl sm:text-5xl font-black font-mono text-amber-600 tracking-tight block">
            403
          </span>
          <h1 class="text-xl sm:text-2xl font-extrabold text-brand-text-primary font-sans">
            Acceso Restringido
          </h1>
          <p class="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
            Tu perfil de usuario no cuenta con privilegios administrativos para acceder a esta área. El panel de control está reservado para la administración y cocina de Brasas a Wok.
          </p>
        </div>

        <div *ngIf="authService.isLoggedIn()" class="p-3 bg-brand-surface-alt rounded-xl border border-brand-border text-xs text-brand-text-secondary text-left space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-brand-text-muted">Usuario activo:</span>
            <strong class="text-brand-text-primary">{{ authService.currentUser()?.fullName }}</strong>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-brand-text-muted">Rol asignado:</span>
            <span class="font-mono text-[11px] font-semibold text-brand-primary uppercase">
              {{ authService.currentUser()?.role }}
            </span>
          </div>
        </div>

        <div class="pt-2 flex flex-col gap-2.5">
          <a
            routerLink="/carta"
            class="w-full py-3 px-4 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-card transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <app-icon name="shopping-bag" [size]="16"></app-icon>
            <span>Ir a la Carta Gastronómica</span>
          </a>

          <div class="flex gap-2">
            <button
              type="button"
              (click)="showLoginModal = true"
              class="flex-1 py-2.5 px-3 bg-brand-surface-alt hover:bg-brand-border/60 text-brand-text-primary text-xs font-semibold rounded-xl border border-brand-border transition-all"
            >
              Iniciar como Admin
            </button>

            <a
              routerLink="/"
              class="py-2.5 px-4 bg-transparent hover:bg-brand-surface-alt text-brand-text-secondary text-xs font-semibold rounded-xl transition-all flex items-center justify-center"
            >
              Inicio
            </a>
          </div>
        </div>
      </div>

      <app-auth-modal *ngIf="showLoginModal" (closeEvent)="onLoginClosed()"></app-auth-modal>
    </div>
  `
})
export class ForbiddenComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  showLoginModal = false;

  onLoginClosed(): void {
    this.showLoginModal = false;
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }
}
