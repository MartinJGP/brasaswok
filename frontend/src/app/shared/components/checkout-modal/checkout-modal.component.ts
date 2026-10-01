import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IconComponent } from '../icon/icon.component';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

export type PaymentMethodType = 'TARJETA' | 'YAPE_PLIN' | 'EFECTIVO' | 'TRANSFERENCIA';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        class="fixed inset-0 bg-brand-secondary/75 backdrop-blur-sm transition-opacity"
        (click)="step !== 'processing' ? close() : null"
        aria-hidden="true"
      ></div>

      <div
        class="relative w-full max-w-xl bg-brand-surface rounded-2xl shadow-dropdown border border-brand-border overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-6"
        role="dialog"
        aria-modal="true"
      >
        <ng-container *ngIf="step === 'form'">
          <div class="p-5 sm:p-6 border-b border-brand-border flex items-center justify-between bg-brand-surface-alt/50">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-subtle">
                <app-icon name="shopping-bag" [size]="18"></app-icon>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-bold text-brand-text-primary font-sans">
                  Finalizar Pedido & Pago
                </h3>
                <p class="text-xs text-brand-text-secondary">
                  Delivery Express • Brasas a Wok
                </p>
              </div>
            </div>

            <button
              type="button"
              (click)="close()"
              class="p-1.5 text-brand-text-muted hover:text-brand-text-primary rounded-lg transition-colors"
              aria-label="Cerrar ventana de pago"
            >
              <app-icon name="x" [size]="20"></app-icon>
            </button>
          </div>

          <form (ngSubmit)="processCheckout()" class="p-5 sm:p-6 space-y-5">
            <div class="space-y-3">
              <h4 class="text-xs font-bold text-brand-text-primary uppercase tracking-wider flex items-center gap-2">
                <app-icon name="map-pin" [size]="14" customClass="text-brand-primary"></app-icon>
                <span>1. Datos de Entrega</span>
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-brand-text-primary mb-1">Dirección de Entrega</label>
                  <input
                    type="text"
                    [(ngModel)]="deliveryAddress"
                    name="deliveryAddress"
                    required
                    placeholder="Ingresa tu dirección de entrega"
                    class="w-full px-3 py-2 text-xs bg-brand-surface-alt border border-brand-border rounded-xl text-brand-text-primary placeholder-brand-text-muted focus:bg-brand-surface focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-brand-text-primary mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    [(ngModel)]="deliveryPhone"
                    name="deliveryPhone"
                    required
                    placeholder="Ej: 987654321"
                    class="w-full px-3 py-2 text-xs bg-brand-surface-alt border border-brand-border rounded-xl text-brand-text-primary placeholder-brand-text-muted focus:bg-brand-surface focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-brand-text-primary mb-1">Indicaciones (Opcional)</label>
                  <input
                    type="text"
                    [(ngModel)]="deliveryNotes"
                    name="deliveryNotes"
                    placeholder="Tocar timbre, dejar en recepción..."
                    class="w-full px-3 py-2 text-xs bg-brand-surface-alt border border-brand-border rounded-xl text-brand-text-primary placeholder-brand-text-muted focus:bg-brand-surface focus:border-brand-primary"
                  />
                </div>
              </div>
            </div>

            <div class="space-y-3 pt-2 border-t border-brand-border">
              <h4 class="text-xs font-bold text-brand-text-primary uppercase tracking-wider flex items-center gap-2">
                <app-icon name="dollar" [size]="14" customClass="text-brand-accent"></app-icon>
                <span>2. Método de Pago</span>
              </h4>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  (click)="selectedMethod = 'TARJETA'"
                  [class.border-brand-primary]="selectedMethod === 'TARJETA'"
                  [class.bg-brand-primary/5]="selectedMethod === 'TARJETA'"
                  [class.text-brand-primary]="selectedMethod === 'TARJETA'"
                  [class.border-brand-border]="selectedMethod !== 'TARJETA'"
                  [class.bg-brand-surface-alt]="selectedMethod !== 'TARJETA'"
                  class="p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center gap-1.5"
                >
                  <app-icon name="dashboard" [size]="18"></app-icon>
                  <span>Tarjeta</span>
                </button>

                <button
                  type="button"
                  (click)="selectedMethod = 'YAPE_PLIN'"
                  [class.border-brand-primary]="selectedMethod === 'YAPE_PLIN'"
                  [class.bg-brand-primary/5]="selectedMethod === 'YAPE_PLIN'"
                  [class.text-brand-primary]="selectedMethod === 'YAPE_PLIN'"
                  [class.border-brand-border]="selectedMethod !== 'YAPE_PLIN'"
                  [class.bg-brand-surface-alt]="selectedMethod !== 'YAPE_PLIN'"
                  class="p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center gap-1.5"
                >
                  <app-icon name="phone" [size]="18"></app-icon>
                  <span>Yape / Plin</span>
                </button>

                <button
                  type="button"
                  (click)="selectedMethod = 'EFECTIVO'"
                  [class.border-brand-primary]="selectedMethod === 'EFECTIVO'"
                  [class.bg-brand-primary/5]="selectedMethod === 'EFECTIVO'"
                  [class.text-brand-primary]="selectedMethod === 'EFECTIVO'"
                  [class.border-brand-border]="selectedMethod !== 'EFECTIVO'"
                  [class.bg-brand-surface-alt]="selectedMethod !== 'EFECTIVO'"
                  class="p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center gap-1.5"
                >
                  <app-icon name="dollar" [size]="18"></app-icon>
                  <span>Efectivo</span>
                </button>

                <button
                  type="button"
                  (click)="selectedMethod = 'TRANSFERENCIA'"
                  [class.border-brand-primary]="selectedMethod === 'TRANSFERENCIA'"
                  [class.bg-brand-primary/5]="selectedMethod === 'TRANSFERENCIA'"
                  [class.text-brand-primary]="selectedMethod === 'TRANSFERENCIA'"
                  [class.border-brand-border]="selectedMethod !== 'TRANSFERENCIA'"
                  [class.bg-brand-surface-alt]="selectedMethod !== 'TRANSFERENCIA'"
                  class="p-2.5 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center gap-1.5"
                >
                  <app-icon name="truck" [size]="18"></app-icon>
                  <span>Transferencia</span>
                </button>
              </div>

              <div *ngIf="selectedMethod === 'TARJETA'" class="space-y-3 pt-2">
                <div class="relative w-full h-40 rounded-2xl p-4 bg-gradient-to-tr from-stone-900 via-neutral-900 to-amber-950 text-white shadow-card flex flex-col justify-between overflow-hidden border border-white/10">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold tracking-widest uppercase text-brand-accent">Brasas a Wok • Gourmet Card</span>
                    <span class="text-xs font-mono font-bold">VISA / MC</span>
                  </div>

                  <div class="w-8 h-6 rounded-md bg-amber-400/80 border border-amber-300"></div>

                  <div>
                    <span class="block font-mono text-sm sm:text-base tracking-widest font-bold">
                      {{ cardNumber || '•••• •••• •••• 4242' }}
                    </span>
                    <div class="flex items-center justify-between text-[10px] text-white/70 pt-1">
                      <span class="uppercase">{{ cardHolder || authService.currentUser()?.fullName || 'CLIENTE GOURMET' }}</span>
                      <span class="font-mono">{{ cardExpiry || '12/28' }}</span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div class="col-span-2 sm:col-span-1">
                    <label class="block text-[11px] font-medium text-brand-text-secondary mb-1">N° de Tarjeta</label>
                    <input
                      type="text"
                      [(ngModel)]="cardNumber"
                      name="cardNumber"
                      maxlength="19"
                      placeholder="4557 1234 5678 4242"
                      class="w-full px-2.5 py-1.5 bg-brand-surface-alt border border-brand-border rounded-lg text-brand-text-primary font-mono text-xs focus:bg-brand-surface focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-medium text-brand-text-secondary mb-1">Vence (MM/AA)</label>
                    <input
                      type="text"
                      [(ngModel)]="cardExpiry"
                      name="cardExpiry"
                      maxlength="5"
                      placeholder="08/28"
                      class="w-full px-2.5 py-1.5 bg-brand-surface-alt border border-brand-border rounded-lg text-brand-text-primary font-mono text-xs focus:bg-brand-surface focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-medium text-brand-text-secondary mb-1">CVV</label>
                    <input
                      type="password"
                      [(ngModel)]="cardCvv"
                      name="cardCvv"
                      maxlength="4"
                      placeholder="•••"
                      class="w-full px-2.5 py-1.5 bg-brand-surface-alt border border-brand-border rounded-lg text-brand-text-primary font-mono text-xs focus:bg-brand-surface focus:border-brand-primary"
                    />
                  </div>
                </div>
              </div>

              <div *ngIf="selectedMethod === 'YAPE_PLIN'" class="p-4 rounded-xl bg-brand-surface-alt border border-brand-border space-y-3">
                <div class="flex items-center gap-4">
                  <div class="w-20 h-20 bg-white p-1 rounded-xl shadow-subtle border border-brand-border flex items-center justify-center shrink-0">
                    <div class="w-full h-full bg-stone-900 rounded-lg flex flex-col items-center justify-center text-white text-[9px] font-mono leading-tight">
                      <app-icon name="flame" [size]="20" customClass="text-brand-accent"></app-icon>
                      <span>QR YAPE</span>
                    </div>
                  </div>
                  <div class="space-y-1 text-xs">
                    <span class="font-bold text-brand-text-primary block">Yapea o Plinea al instante:</span>
                    <p class="font-mono text-sm font-extrabold text-brand-primary">987 654 321</p>
                    <p class="text-brand-text-secondary text-[11px]">Titular: Brasas a Wok S.A.C.</p>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-brand-text-primary mb-1">
                    Código de Operación o Aprobación
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="yapeRef"
                    name="yapeRef"
                    placeholder="Ej: 849201"
                    class="w-full px-3 py-2 text-xs bg-brand-surface border border-brand-border rounded-xl font-mono text-brand-text-primary focus:border-brand-primary"
                  />
                </div>
              </div>

              <div *ngIf="selectedMethod === 'EFECTIVO'" class="p-4 rounded-xl bg-brand-surface-alt border border-brand-border space-y-2.5 text-xs">
                <span class="font-bold text-brand-text-primary block">Pago en Efectivo contra Entrega</span>
                <p class="text-brand-text-secondary text-[11px]">
                  El repartidor llevará vuelto exacto según tu indicación.
                </p>
                <div class="flex items-center gap-3">
                  <label class="text-brand-text-secondary">¿Pagas con billete de:</label>
                  <div class="relative w-32">
                    <span class="absolute left-2.5 top-2 text-xs font-bold text-brand-text-muted">S/</span>
                    <input
                      type="number"
                      [(ngModel)]="cashAmount"
                      name="cashAmount"
                      class="w-full pl-7 pr-2 py-1.5 text-xs bg-brand-surface border border-brand-border rounded-lg text-brand-text-primary font-mono font-bold"
                    />
                  </div>
                </div>
                <div *ngIf="cashAmount > cartService.total()" class="text-[11px] text-brand-status-success font-semibold">
                  Tu vuelto será: S/ {{ (cashAmount - cartService.total()).toFixed(2) }}
                </div>
              </div>

              <div *ngIf="selectedMethod === 'TRANSFERENCIA'" class="p-4 rounded-xl bg-brand-surface-alt border border-brand-border space-y-2 text-xs">
                <span class="font-bold text-brand-text-primary block">Cuentas Corrientes Empresariales:</span>
                <p class="text-[11px] text-brand-text-secondary">
                  <strong>BCP Soles:</strong> 193-84729104-0-91<br>
                  <strong>BBVA Soles:</strong> 0011-0284-0100049281<br>
                  <strong>CCI:</strong> 002-193-008472910400-91
                </p>
                <input
                  type="text"
                  [(ngModel)]="transferRef"
                  name="transferRef"
                  placeholder="Número de operación de transferencia"
                  class="w-full px-3 py-2 text-xs bg-brand-surface border border-brand-border rounded-xl font-mono text-brand-text-primary focus:border-brand-primary"
                />
              </div>
            </div>

            <div class="pt-3 border-t border-brand-border space-y-2">
              <div class="flex justify-between text-xs text-brand-text-secondary">
                <span>Subtotal ({{ cartService.totalCount() }} platos):</span>
                <span class="font-mono">S/ {{ cartService.subtotal().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-xs text-brand-text-secondary">
                <span>Delivery:</span>
                <span class="font-mono">S/ {{ cartService.deliveryFee().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm sm:text-base font-bold text-brand-text-primary pt-1 border-t border-brand-border">
                <span>Total a Pagar:</span>
                <span class="font-mono text-brand-primary text-lg">S/ {{ cartService.total().toFixed(2) }}</span>
              </div>
            </div>

            <button
              type="submit"
              [disabled]="!deliveryAddress || !deliveryPhone"
              class="w-full py-3.5 px-4 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-card transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <app-icon name="check" [size]="18"></app-icon>
              <span>Pagar y Confirmar Pedido • S/ {{ cartService.total().toFixed(2) }}</span>
            </button>
          </form>
        </ng-container>

        <div *ngIf="step === 'processing'" class="p-12 text-center space-y-4">
          <div class="w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary mx-auto flex items-center justify-center animate-spin">
            <app-icon name="flame" [size]="32"></app-icon>
          </div>
          <div class="space-y-1">
            <h4 class="text-base font-bold text-brand-text-primary">Procesando tu pedido</h4>
            <p class="text-xs text-brand-text-secondary">
              Conectando con cocina y validando pago simulado...
            </p>
          </div>
        </div>

        <div *ngIf="step === 'success'" class="p-6 sm:p-8 text-center space-y-6 animate-in fade-in duration-300">
          <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20 shadow-subtle">
            <app-icon name="check" [size]="32"></app-icon>
          </div>

          <div class="space-y-1">
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
              ¡Pago y Pedido Confirmados!
            </span>
            <h3 class="text-xl sm:text-2xl font-black text-brand-text-primary font-sans">
              Orden #BW-{{ confirmedOrderNumber }}
            </h3>
            <p class="text-xs text-brand-text-secondary max-w-sm mx-auto leading-relaxed">
              La cocina ha recibido tu comanda. Tus platos serán preparados al momento con fuego vivo.
            </p>
          </div>

          <div class="p-4 bg-brand-surface-alt rounded-2xl border border-brand-border text-xs text-left space-y-2.5">
            <div class="flex items-center justify-between pb-2 border-b border-brand-border">
              <span class="text-brand-text-muted">Estado Actual:</span>
              <span class="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold flex items-center gap-1">
                <app-icon name="flame" [size]="12"></app-icon>
                <span>En Cola de Cocina</span>
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-brand-text-muted">Tiempo Estimado:</span>
              <span class="font-bold text-brand-text-primary">30 - 45 minutos</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-brand-text-muted">Destino:</span>
              <span class="font-medium text-brand-text-primary truncate max-w-[200px]">{{ deliveryAddress }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-brand-text-muted">Método de Pago:</span>
              <span class="font-semibold text-brand-primary">{{ selectedMethod }}</span>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-brand-border text-sm font-bold">
              <span>Total Pagado:</span>
              <span class="font-mono text-brand-primary">S/ {{ confirmedTotal.toFixed(2) }}</span>
            </div>
          </div>

          <button
            type="button"
            (click)="finish()"
            class="w-full py-3.5 px-4 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-card transition-all active:scale-95"
          >
            Listo, volver a la Carta
          </button>
        </div>

        <div *ngIf="step === 'error'" class="p-8 text-center space-y-4 animate-in fade-in duration-200">
          <div class="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center border border-rose-500/20 shadow-subtle">
            <app-icon name="alert" [size]="32"></app-icon>
          </div>
          <div class="space-y-1">
            <h4 class="text-base font-bold text-brand-text-primary">No se pudo completar el pedido</h4>
            <p class="text-xs text-rose-600 max-w-sm mx-auto leading-relaxed">
              {{ errorMessage }}
            </p>
          </div>
          <div class="pt-2 flex justify-center gap-3">
            <button
              type="button"
              (click)="step = 'form'"
              class="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-card transition-all"
            >
              Volver al Formulario
            </button>
            <button
              type="button"
              (click)="close()"
              class="px-4 py-2 bg-brand-surface-alt hover:bg-brand-border/60 text-brand-text-primary text-xs font-semibold rounded-xl border border-brand-border transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `
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

    this.http.post<any>('http://localhost:8080/api/orders', orderPayload).subscribe({
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

        this.http.post<any>('http://localhost:8080/api/payments/process', paymentPayload).subscribe({
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
