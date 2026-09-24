import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'brasas_cart';

  private readonly _items = signal<CartItem[]>(this.getStoredCart());
  private readonly _isDrawerOpen = signal<boolean>(false);
  private readonly _deliveryFee = signal<number>(5.00);

  readonly items = this._items.asReadonly();
  readonly isDrawerOpen = this._isDrawerOpen.asReadonly();
  readonly deliveryFee = this._deliveryFee.asReadonly();

  readonly totalCount = computed(() => {
    return this._items().reduce((acc, item) => acc + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this._items().reduce((acc, item) => acc + item.subtotal, 0);
  });

  readonly total = computed(() => {
    const sub = this.subtotal();
    return sub > 0 ? sub + this._deliveryFee() : 0;
  });

  addItem(product: { id: number; name: string; price: number; category: string }, quantity: number = 1, notes: string = ''): void {
    const currentItems = [...this._items()];
    const existingIndex = currentItems.findIndex(i => i.productId === product.id && i.notes === notes);

    if (existingIndex > -1) {
      const existing = currentItems[existingIndex];
      const newQty = existing.quantity + quantity;
      currentItems[existingIndex] = {
        ...existing,
        quantity: newQty,
        subtotal: Number((newQty * existing.price).toFixed(2))
      };
    } else {
      currentItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        notes: notes,
        subtotal: Number((quantity * product.price).toFixed(2)),
        category: product.category
      });
    }

    this.saveCart(currentItems);
  }

  updateQuantity(productId: number, delta: number): void {
    const currentItems = [...this._items()];
    const index = currentItems.findIndex(i => i.productId === productId);

    if (index > -1) {
      const item = currentItems[index];
      const newQty = item.quantity + delta;

      if (newQty <= 0) {
        currentItems.splice(index, 1);
      } else {
        currentItems[index] = {
          ...item,
          quantity: newQty,
          subtotal: Number((newQty * item.price).toFixed(2))
        };
      }

      this.saveCart(currentItems);
    }
  }

  removeItem(productId: number): void {
    const filtered = this._items().filter(i => i.productId !== productId);
    this.saveCart(filtered);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  openDrawer(): void {
    this._isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this._isDrawerOpen.set(false);
  }

  toggleDrawer(): void {
    this._isDrawerOpen.update(v => !v);
  }

  private saveCart(items: CartItem[]): void {
    this._items.set(items);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    }
  }

  private getStoredCart(): CartItem[] {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.CART_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  }
}
