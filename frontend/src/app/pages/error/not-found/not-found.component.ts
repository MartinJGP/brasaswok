import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-brand-surface rounded-3xl border border-brand-border p-8 sm:p-10 shadow-card text-center space-y-6">
        <div class="w-16 h-16 rounded-2xl bg-brand-primary-light text-brand-primary mx-auto flex items-center justify-center shadow-subtle">
          <app-icon name="flame" [size]="32"></app-icon>
        </div>

        <div class="space-y-2">
          <span class="text-5xl sm:text-6xl font-black font-mono text-brand-primary tracking-tight block">
            404
          </span>
          <h1 class="text-xl sm:text-2xl font-extrabold text-brand-text-primary font-sans">
            Mesa o Sección No Encontrada
          </h1>
          <p class="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
            La página a la que intentas ingresar no existe, fue movida o no está disponible en este momento.
          </p>
        </div>

        <div class="pt-2 flex flex-col sm:flex-row items-stretch gap-3">
          <a
            routerLink="/carta"
            class="flex-1 py-3 px-4 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-card transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <app-icon name="menu" [size]="16"></app-icon>
            <span>Ver Carta Gastronómica</span>
          </a>

          <a
            routerLink="/"
            class="py-3 px-4 bg-brand-surface-alt hover:bg-brand-border/60 text-brand-text-primary text-xs font-bold rounded-xl border border-brand-border transition-all flex items-center justify-center"
          >
            Inicio
          </a>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
