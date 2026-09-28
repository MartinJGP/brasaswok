import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishCategory } from '../../../../core/models/dish.model';
import { IconComponent, IconName } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-category-bar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <nav
      class="w-full bg-brand-surface/95 backdrop-blur-md border-y border-brand-border sticky top-20 z-30 py-3 shadow-subtle"
      aria-label="Categorías del menú"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          <button
            *ngFor="let cat of categories"
            type="button"
            (click)="categorySelect.emit(cat)"
            [class.bg-brand-primary]="activeCategory === cat"
            [class.text-white]="activeCategory === cat"
            [class.border-brand-primary]="activeCategory === cat"
            [class.shadow-card]="activeCategory === cat"
            [class.scale-[1.02]]="activeCategory === cat"
            [class.bg-brand-surface-alt]="activeCategory !== cat"
            [class.text-brand-text-secondary]="activeCategory !== cat"
            [class.border-brand-border]="activeCategory !== cat"
            [class.hover:text-brand-text-primary]="activeCategory !== cat"
            [class.hover:border-brand-primary/30]="activeCategory !== cat"
            class="group inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-200 whitespace-nowrap active:scale-95 shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            [attr.aria-current]="activeCategory === cat ? 'page' : null"
          >
            <app-icon
              [name]="getCategoryIcon(cat)"
              [size]="16"
              [customClass]="activeCategory === cat ? 'text-white' : 'text-brand-text-muted group-hover:text-brand-primary transition-colors'"
            ></app-icon>

            <span>{{ cat }}</span>

            <span
              [class.bg-white/20]="activeCategory === cat"
              [class.text-white]="activeCategory === cat"
              [class.bg-brand-border/60]="activeCategory !== cat"
              [class.text-brand-text-muted]="activeCategory !== cat"
              class="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-full transition-colors"
            >
              {{ counts[cat] ?? 0 }}
            </span>
          </button>
        </div>
      </div>
    </nav>
  `
})
export class CategoryBarComponent {
  @Input({ required: true }) categories: DishCategory[] = [];
  @Input({ required: true }) activeCategory: DishCategory = 'Todos';
  @Input() counts: Record<string, number> = {};
  @Output() categorySelect = new EventEmitter<DishCategory>();

  getCategoryIcon(category: DishCategory): IconName {
    switch (category) {
      case 'Brasas & Pollos':
        return 'flame';
      case 'Wok & Salteados':
        return 'menu';
      case 'Chaufas & Aeropuertos':
        return 'categories';
      case 'Entradas & Piques':
        return 'check';
      case 'Bebidas':
        return 'shopping-bag';
      default:
        return 'menu';
    }
  }
}
