import { Component, OnInit, inject, computed } from '@angular/core';
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
export class HomeComponent implements OnInit {
  public readonly menuService = inject(MenuService);
  public readonly cartService = inject(CartService);
  public readonly authService = inject(AuthService);

  activeDishForModal: DishData | null = null;

  readonly starDishes = computed<DishData[]>(() => {
    const list = this.menuService.dishes();
    const stars = list.filter(d => d.isStar);
    return stars.length >= 3 ? stars.slice(0, 3) : list.slice(0, 3);
  });

  ngOnInit(): void {
    if (this.menuService.dishes().length === 0) {
      this.menuService.loadDishes();
    }
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
