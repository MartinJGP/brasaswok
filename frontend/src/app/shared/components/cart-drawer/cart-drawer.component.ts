import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { CheckoutModalComponent } from '../checkout-modal/checkout-modal.component';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, IconComponent, CheckoutModalComponent],
  templateUrl: './cart-drawer.component.html'
})
export class CartDrawerComponent {
  @Output() requestAuth = new EventEmitter<void>();

  showCheckoutModal = false;

  constructor(
    public readonly cartService: CartService,
    public readonly authService: AuthService
  ) {}

  // abre modal de pago y checkout
  openCheckout(): void {
    if (this.authService.isAdmin()) {
      this.requestAuth.emit();
      return;
    }
    this.showCheckoutModal = true;
  }

  // finaliza pedido y limpia comanda
  onOrderCompleted(event: any): void {
    this.showCheckoutModal = false;
    this.cartService.closeDrawer();
  }
}
