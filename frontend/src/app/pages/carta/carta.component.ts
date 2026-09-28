import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../core/services/menu.service';
import { CartService } from '../../core/services/cart.service';
import { Dish, DishCategory } from '../../core/models/dish.model';
import { CategoryBarComponent } from './components/category-bar/category-bar.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { DishModalComponent } from '../../shared/components/dish-modal/dish-modal.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CategoryBarComponent,
    ProductCardComponent,
    DishModalComponent,
    IconComponent
  ],
  templateUrl: './carta.component.html'
})
export class CartaComponent {
  private readonly menuService = inject(MenuService);
  readonly cartService = inject(CartService);

  readonly categories = this.menuService.categories;
  readonly selectedCategory = signal<DishCategory>('Todos');
  readonly searchTerm = signal<string>('');

  readonly activeDishForModal = signal<Dish | null>(null);

  readonly categoryCounts = computed(() => {
    const counts: Record<string, number> = {};
    for (const cat of this.categories) {
      counts[cat] = this.menuService.getCategoryCount(cat);
    }
    return counts;
  });

  readonly filteredDishes = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchTerm().trim().toLowerCase();
    const dishes = this.menuService.dishes();

    return dishes.filter(dish => {
      const matchesCategory = category === 'Todos' || dish.category === category;
      const matchesSearch =
        query === '' ||
        dish.name.toLowerCase().includes(query) ||
        dish.description.toLowerCase().includes(query) ||
        dish.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  });

  onCategorySelect(category: DishCategory): void {
    this.selectedCategory.set(category);
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  clearAllFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('Todos');
  }

  openDishModal(dish: Dish): void {
    this.activeDishForModal.set(dish);
  }

  closeDishModal(): void {
    this.activeDishForModal.set(null);
  }

  getDishCartQuantity(dishId: number): number {
    const item = this.cartService.items().find(i => i.productId === dishId);
    return item ? item.quantity : 0;
  }

  onQuickAdd(dish: Dish): void {
    this.cartService.addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      category: dish.category
    }, 1);
  }

  onUpdateQuantity(event: { dish: Dish; delta: number }): void {
    this.cartService.updateQuantity(event.dish.id, event.delta);
  }

  onAddDishWithCustomization(event: { dish: Dish; quantity: number; notes: string }): void {
    this.cartService.addItem({
      id: event.dish.id,
      name: event.dish.name,
      price: event.dish.price,
      category: event.dish.category
    }, event.quantity, event.notes);
  }
}
