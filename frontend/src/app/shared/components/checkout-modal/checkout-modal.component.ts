import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IconComponent } from '../icon/icon.component';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

export type PaymentMethodType = 'TARJETA' | 'YAPE_PLIN' | 'EFECTIVO' | 'TRANSFERENCIA';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './checkout-modal.component.html'
})
export class CheckoutModalComponent {
  private _isOpen = false;
  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.populateUserDetails();
    }
  }
  get isOpen(): boolean {
    return this._isOpen;
  }

  @Output() closeEvent = new EventEmitter<void>();
  @Output() orderCompleted = new EventEmitter<any>();

  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  step: 'form' | 'processing' | 'success' | 'error' = 'form';
  selectedMethod: PaymentMethodType = 'TARJETA';
  errorMessage = '';

  deliveryAddress = '';
  deliveryPhone = '';
  deliveryNotes = '';

  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  cardHolder = '';

  yapeRef = '849201';
  cashAmount = 100;
  transferRef = 'OP-948102';

  confirmedOrderNumber = '';
  confirmedTotal = 0;

  // asigna datos por defecto del usuario autenticado
  populateUserDetails(): void {
    const user = this.authService.currentUser();
    if (user?.address) {
      this.deliveryAddress = user.address;
    }
    if (user?.phone) {
      this.deliveryPhone = user.phone;
    }
    if (user?.fullName && !this.cardHolder) {
      this.cardHolder = user.fullName.toUpperCase();
    }
  }

  // procesa comanda y pago en el backend
  processCheckout(): void {
    this.errorMessage = '';

    if (this.authService.isAdmin()) {
      this.step = 'error';
      this.errorMessage = 'Los pedidos de delivery solo pueden ser realizados por clientes. Tu cuenta tiene rol de Administrador.';
      return;
    }

    this.step = 'processing';
    this.confirmedTotal = this.cartService.total();

    const orderPayload = {
      deliveryAddress: this.deliveryAddress,
      deliveryPhone: this.deliveryPhone,
      deliveryNotes: this.deliveryNotes,
      paymentMethod: this.selectedMethod,
      items: this.cartService.items().map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        notes: i.notes || ''
      }))
    };

    this.http.post<any>(`${environment.apiUrl}/orders`, orderPayload).subscribe({
      next: (createdOrder) => {
        if (createdOrder?.orderNumber) {
          this.confirmedOrderNumber = createdOrder.orderNumber;
        }

        const paymentPayload = {
          orderId: createdOrder.id,
          paymentMethod: this.selectedMethod,
          amount: createdOrder.totalAmount,
          transactionReference: this.getTransactionReference()
        };

        this.http.post<any>(`${environment.apiUrl}/payments/process`, paymentPayload).subscribe({
          next: () => {
            this.handleSuccess();
          },
          error: (payErr) => {
            this.step = 'error';
            this.errorMessage = payErr?.error?.message || 'El pedido fue creado pero falló el registro del pago simulado.';
          }
        });
      },
      error: (ordErr) => {
        this.step = 'error';
        this.errorMessage = ordErr?.error?.message || 'No se pudo registrar la comanda en el servidor. Verifica tu conexión.';
      }
    });
  }

  // genera codigo de referencia segun metodo
  private getTransactionReference(): string {
    switch (this.selectedMethod) {
      case 'TARJETA':
        return `CARD-${this.cardNumber.slice(-4) || '4242'}`;
      case 'YAPE_PLIN':
        return `YAPE-${this.yapeRef}`;
      case 'TRANSFERENCIA':
        return `TRANS-${this.transferRef}`;
      case 'EFECTIVO':
        return `CASH-${this.cashAmount}`;
    }
  }

  // completa pedido y limpia carrito
  private handleSuccess(): void {
    this.step = 'success';
    this.cartService.clearCart();
    this.orderCompleted.emit({
      orderNumber: this.confirmedOrderNumber,
      total: this.confirmedTotal,
      method: this.selectedMethod
    });
  }

  // resetea estado y cierra modal
  close(): void {
    this.step = 'form';
    this.errorMessage = '';
    this.closeEvent.emit();
  }

  // finaliza flujo de compra
  finish(): void {
    this.close();
    this.cartService.closeDrawer();
  }
}
