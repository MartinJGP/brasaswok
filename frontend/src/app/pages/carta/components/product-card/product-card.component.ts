import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dish } from '../../../../core/models/dish.model';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <article
      class="group relative flex flex-col bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-subtle hover:shadow-dropdown hover:border-brand-primary/40 transition-all duration-300"
    >
      <div
        class="relative w-full aspect-[16/10] overflow-hidden bg-brand-secondary cursor-pointer select-none"
        (click)="selectDish.emit(dish)"
        role="button"
        [attr.aria-label]="'Ver detalle de ' + dish.name"
      >
        <img
          [src]="dish.imageUrl"
          [alt]="dish.name"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30 pointer-events-none"></div>

        <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-sm">
            {{ dish.category }}
          </span>

          <span
            *ngIf="dish.isStar"
            class="text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-brand-primary text-white shadow-card flex items-center gap-1"
          >
            <app-icon name="flame" [size]="13" customClass="text-amber-200"></app-icon>
            <span>Estrella</span>
          </span>

          <span
            *ngIf="!dish.isStar && dish.badgeText"
            class="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-accent text-white shadow-card"
          >
            {{ dish.badgeText }}
          </span>
        </div>

        <div class="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white/90 text-[11px] pointer-events-none">
          <span *ngIf="dish.prepTime" class="inline-flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md font-medium">
            <app-icon name="clock" [size]="12" customClass="text-brand-accent"></app-icon>
            <span>{{ dish.prepTime }}</span>
          </span>

          <span *ngIf="dish.servings" class="bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md font-medium">
            {{ dish.servings }}
          </span>
        </div>
      </div>

      <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div class="space-y-1.5">
          <h3
            (click)="selectDish.emit(dish)"
            class="text-base sm:text-lg font-bold text-brand-text-primary group-hover:text-brand-primary transition-colors cursor-pointer leading-snug line-clamp-1 font-sans"
          >
            {{ dish.name }}
          </h3>

          <p class="text-xs sm:text-sm text-brand-text-secondary leading-relaxed line-clamp-2">
            {{ dish.description }}
          </p>
        </div>

        <div class="pt-3 border-t border-brand-border/70 flex items-center justify-between gap-3">
          <div class="flex flex-col">
            <span class="text-[10px] font-semibold text-brand-text-muted uppercase tracking-wider">Precio</span>
            <span class="text-lg sm:text-xl font-black text-brand-primary font-mono leading-none">
              <span class="text-xs font-bold mr-0.5">S/</span>{{ dish.price.toFixed(2) }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="selectDish.emit(dish)"
              class="p-2 text-brand-text-muted hover:text-brand-text-primary hover:bg-brand-surface-alt rounded-xl transition-colors text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
              title="Personalizar pedido e instrucciones"
              aria-label="Personalizar plato"
            >
              <app-icon name="settings" [size]="17"></app-icon>
            </button>

            <ng-container *ngIf="inCartQuantity === 0; else stepperTpl">
              <button
                type="button"
                (click)="quickAdd.emit(dish)"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-card transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                [attr.aria-label]="'Agregar ' + dish.name + ' al carrito'"
              >
                <app-icon name="plus" [size]="15"></app-icon>
                <span>Agregar</span>
              </button>
            </ng-container>

            <ng-template #stepperTpl>
              <div class="inline-flex items-center border border-brand-primary/40 bg-brand-primary/5 rounded-xl p-0.5">
                <button
                  type="button"
                  (click)="updateQuantity.emit({ dish: dish, delta: -1 })"
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                  aria-label="Disminuir cantidad"
                >
                  <app-icon name="minus" [size]="13"></app-icon>
                </button>
                <span class="w-8 text-center text-xs font-bold text-brand-primary font-mono">
                  {{ inCartQuantity }}
                </span>
                <button
                  type="button"
                  (click)="updateQuantity.emit({ dish: dish, delta: 1 })"
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all active:scale-90"
                  aria-label="Aumentar cantidad"
                >
                  <app-icon name="plus" [size]="13"></app-icon>
                </button>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </article>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) dish!: Dish;
  @Input() inCartQuantity: number = 0;
  @Output() selectDish = new EventEmitter<Dish>();
  @Output() quickAdd = new EventEmitter<Dish>();
  @Output() updateQuantity = new EventEmitter<{ dish: Dish; delta: number }>();
}
