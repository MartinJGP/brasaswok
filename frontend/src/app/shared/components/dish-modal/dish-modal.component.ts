import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

import { Dish } from '../../../core/models/dish.model';

export type DishData = Dish;

@Component({
  selector: 'app-dish-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div *ngIf="dish" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        class="fixed inset-0 bg-brand-secondary/70 backdrop-blur-sm transition-opacity"
        (click)="close()"
        aria-hidden="true"
      ></div>

      <div
        class="relative w-full max-w-lg bg-brand-surface rounded-2xl shadow-dropdown border border-brand-border overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-8"
        role="dialog"
        aria-modal="true"
      >
        <div *ngIf="dish.imageUrl" class="relative h-48 sm:h-56 w-full overflow-hidden bg-brand-secondary">
          <img
            [src]="dish.imageUrl"
            [alt]="dish.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
          
          <button
            type="button"
            (click)="close()"
            class="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm"
            aria-label="Cerrar modal"
          >
            <app-icon name="x" [size]="18"></app-icon>
          </button>

          <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-primary/90 backdrop-blur-sm">
              {{ dish.category }}
            </span>
            <span *ngIf="dish.isStar" class="text-xs font-semibold text-brand-accent flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
              <app-icon name="flame" [size]="14"></app-icon>
              Plato Estrella
            </span>
          </div>
        </div>

        <div *ngIf="!dish.imageUrl" class="p-6 pb-4 border-b border-brand-border flex items-start justify-between bg-brand-surface-alt/40">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-brand-primary px-2.5 py-0.5 rounded-full bg-brand-primary-light">
              {{ dish.category }}
            </span>
            <h3 class="text-lg font-bold text-brand-text-primary mt-1 font-sans leading-snug">
              {{ dish.name }}
            </h3>
            <span class="text-base font-bold text-brand-primary font-mono block mt-1">
              S/ {{ dish.price.toFixed(2) }}
            </span>
          </div>

          <button
            type="button"
            (click)="close()"
            class="p-1.5 text-brand-text-muted hover:text-brand-text-primary hover:bg-brand-surface-alt rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <app-icon name="x" [size]="20"></app-icon>
          </button>
        </div>

        <div *ngIf="dish.imageUrl" class="px-6 pt-5 pb-2">
          <h3 class="text-xl font-bold text-brand-text-primary font-sans leading-snug">
            {{ dish.name }}
          </h3>
          <span class="text-lg font-bold text-brand-primary font-mono block mt-1">
            S/ {{ dish.price.toFixed(2) }}
          </span>
        </div>

        <div class="p-6 space-y-5">
          <div>
            <h4 class="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1">Descripción</h4>
            <p class="text-xs sm:text-sm text-brand-text-secondary leading-relaxed">
              {{ dish.description }}
            </p>
          </div>

          <div>
            <label class="block text-xs font-bold text-brand-text-primary mb-2">Cantidad</label>
            <div class="inline-flex items-center border border-brand-border rounded-xl bg-brand-surface-alt p-1">
              <button
                type="button"
                (click)="decrement()"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-brand-text-secondary hover:bg-brand-surface hover:text-brand-primary transition-all active:scale-90"
                aria-label="Menos cantidad"
              >
                <app-icon name="minus" [size]="16"></app-icon>
              </button>
              <span class="w-12 text-center text-sm font-bold text-brand-text-primary font-mono">
                {{ quantity }}
              </span>
              <button
                type="button"
                (click)="increment()"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-brand-text-secondary hover:bg-brand-surface hover:text-brand-primary transition-all active:scale-90"
                aria-label="Más cantidad"
              >
                <app-icon name="plus" [size]="16"></app-icon>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-brand-text-primary mb-1.5">
              Instrucciones especiales para cocina (Opcional)
            </label>
            <textarea
              [(ngModel)]="notes"
              rows="2"
              placeholder="Ej: Papas bien crocantes, sin ensalada, ají pollero extra..."
              class="w-full px-3 py-2 text-xs bg-brand-surface-alt border border-brand-border rounded-xl text-brand-text-primary placeholder-brand-text-muted focus:bg-brand-surface focus:border-brand-primary resize-none"
            ></textarea>
          </div>
        </div>

        <div class="p-6 pt-4 border-t border-brand-border bg-brand-surface-alt/40 flex items-center justify-between gap-4">
          <div class="text-left">
            <span class="text-[10px] text-brand-text-muted uppercase font-semibold block">Subtotal</span>
            <span class="text-base font-bold text-brand-text-primary font-mono">
              S/ {{ (dish.price * quantity).toFixed(2) }}
            </span>
          </div>

          <button
            type="button"
            (click)="handleAdd()"
            class="flex-1 py-3 px-4 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-card transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <app-icon name="shopping-bag" [size]="16"></app-icon>
            <span>Agregar al Pedido • S/ {{ (dish.price * quantity).toFixed(2) }}</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class DishModalComponent {
  @Input() dish: DishData | null = null;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() addDish = new EventEmitter<{ dish: DishData; quantity: number; notes: string }>();

  quantity = 1;
  notes = '';

  increment(): void {
    this.quantity++;
  }

  decrement(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  handleAdd(): void {
    if (this.dish) {
      this.addDish.emit({
        dish: this.dish,
        quantity: this.quantity,
        notes: this.notes.trim()
      });
      this.close();
    }
  }

  close(): void {
    this.quantity = 1;
    this.notes = '';
    this.closeEvent.emit();
  }
}
