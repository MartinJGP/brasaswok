import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { MenuService } from '../../core/services/menu.service';
import { DishModalComponent, DishData } from '../../shared/components/dish-modal/dish-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, DishModalComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private readonly menuService = inject(MenuService);
  public readonly cartService = inject(CartService);
  public readonly authService = inject(AuthService);

  selectedCategory = 'Todos';
  activeDishForModal: DishData | null = null;

  readonly categories = this.menuService.categories;

  get dishes(): DishData[] {
    return this.menuService.dishes();
  }

  get filteredDishes(): DishData[] {
    if (this.selectedCategory === 'Todos') {
      return this.dishes;
    }
    return this.dishes.filter(d => d.category === this.selectedCategory);
  }

  getQuantityInCart(productId: number): number {
    const item = this.cartService.items().find(i => i.productId === productId);
    return item ? item.quantity : 0;
  }

  quickAdd(dish: DishData, event: Event): void {
    event.stopPropagation();
    this.cartService.addItem(dish, 1, '');
  }

  openDishModal(dish: DishData): void {
    this.activeDishForModal = dish;
  }

  closeDishModal(): void {
    this.activeDishForModal = null;
  }

  onAddFromModal(event: { dish: DishData; quantity: number; notes: string }): void {
    this.cartService.addItem(event.dish, event.quantity, event.notes);
  }
}
