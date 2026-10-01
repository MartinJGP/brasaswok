import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishCategory } from '../../../../core/models/dish.model';
import { IconComponent, IconName } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-category-bar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './category-bar.component.html'
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
