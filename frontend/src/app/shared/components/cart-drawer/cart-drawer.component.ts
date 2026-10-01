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
  template: `
    <div
      *ngIf="cartService.isDrawerOpen()"
      class="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="absolute inset-0 bg-brand-secondary/60 backdrop-blur-sm transition-opacity"
        (click)="cartService.closeDrawer()"
      ></div>

      <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div class="pointer-events-auto w-screen max-w-md bg-brand-surface shadow-2xl flex flex-col">
          <div class="p-6 border-b border-brand-border flex items-center justify-between bg-brand-surface-alt/50">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-subtle">
                <app-icon name="shopping-bag" [size]="18"></app-icon>
              </div>
              <div>
                <h3 id="slide-over-title" class="text-base font-bold text-brand-text-primary font-sans">
                  Mi Pedido para Delivery
                </h3>
                <p class="text-xs text-brand-text-secondary">
                  {{ cartService.totalCount() }} {{ cartService.totalCount() === 1 ? 'plato seleccionado' : 'platos seleccionados' }}
                </p>
              </div>
            </div>

            <button
              type="button"
              (click)="cartService.closeDrawer()"
              class="p-2 text-brand-text-muted hover:text-brand-text-primary hover:bg-brand-surface-alt rounded-lg transition-colors"
              aria-label="Cerrar pedido"
            >
              <app-icon name="x" [size]="20"></app-icon>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <div *ngIf="cartService.items().length === 0" class="text-center py-16 space-y-4">
              <div class="w-16 h-16 rounded-full bg-brand-surface-alt flex items-center justify-center mx-auto text-brand-text-muted">
                <app-icon name="shopping-bag" [size]="28"></app-icon>
              </div>
              <div class="space-y-1">
                <h4 class="text-base font-bold text-brand-text-primary">Tu comanda está vacía</h4>
                <p class="text-xs text-brand-text-secondary max-w-xs mx-auto">
                  Agrega deliciosos pollos a la brasa o salteados criollos de nuestra carta.
                </p>
              </div>
              <button
                type="button"
                (click)="cartService.closeDrawer()"
                class="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-lg shadow-card transition-all"
              >
                <span>Explorar la Carta</span>
                <app-icon name="arrow-right" [size]="14"></app-icon>
              </button>
            </div>

            <div
              *ngFor="let item of cartService.items()"
              class="p-4 rounded-xl border border-brand-border bg-brand-surface hover:border-brand-primary/30 transition-all space-y-3"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                    {{ item.category }}
                  </span>
                  <h4 class="text-sm font-bold text-brand-text-primary leading-tight">
                    {{ item.name }}
                  </h4>
                  <p *ngIf="item.notes" class="text-xs text-brand-accent italic">
                    "{{ item.notes }}"
                  </p>
                </div>

                <button
                  type="button"
                  (click)="cartService.removeItem(item.productId)"
                  class="text-brand-text-muted hover:text-brand-status-error p-1 transition-colors"
                  title="Eliminar plato"
                >
                  <app-icon name="trash" [size]="16"></app-icon>
                </button>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-brand-border/60">
                <div class="inline-flex items-center border border-brand-border rounded-lg bg-brand-surface-alt">
                  <button
                    type="button"
                    (click)="cartService.updateQuantity(item.productId, -1)"
                    class="p-1.5 text-brand-text-secondary hover:text-brand-primary transition-colors"
                    aria-label="Disminuir cantidad"
                  >
                    <app-icon name="minus" [size]="14"></app-icon>
                  </button>
                  <span class="px-2.5 text-xs font-bold text-brand-text-primary font-mono">
                    {{ item.quantity }}
                  </span>
                  <button
                    type="button"
                    (click)="cartService.updateQuantity(item.productId, 1)"
                    class="p-1.5 text-brand-text-secondary hover:text-brand-primary transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <app-icon name="plus" [size]="14"></app-icon>
                  </button>
                </div>

                <span class="text-sm font-bold text-brand-text-primary font-mono">
                  S/ {{ item.subtotal.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>

          <div *ngIf="cartService.items().length > 0" class="p-6 border-t border-brand-border bg-brand-surface-alt/60 space-y-4">
            <div class="space-y-1.5 text-xs text-brand-text-secondary">
              <div class="flex justify-between">
                <span>Subtotal de Platos:</span>
                <span class="font-mono font-medium text-brand-text-primary">S/ {{ cartService.subtotal().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Costo de Delivery:</span>
                <span class="font-mono font-medium text-brand-text-primary">S/ {{ cartService.deliveryFee().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-base font-bold text-brand-text-primary pt-2 border-t border-brand-border">
                <span>Total a Pagar:</span>
                <span class="font-mono text-brand-primary text-lg">S/ {{ cartService.total().toFixed(2) }}</span>
              </div>
            </div>

            <div *ngIf="authService.isLoggedIn(); else requireLoginTpl">
              <ng-container *ngIf="authService.isAdmin()">
                <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2 text-center mb-3">
                  <div class="inline-flex items-center gap-1.5 text-amber-600 font-bold uppercase text-[10px]">
                    <app-icon name="alert" [size]="12"></app-icon>
                    <span>Rol Administrador Detectado</span>
                  </div>
                  <p class="text-brand-text-secondary text-[11px] leading-relaxed">
                    Para registrar comandas personales y procesar el pago de delivery, inicia sesión con una cuenta de cliente.
                  </p>
                  <button
                    type="button"
                    (click)="requestAuth.emit()"
                    class="w-full py-2.5 px-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-lg shadow-card transition-all"
                  >
                    Iniciar como Cliente
                  </button>
                </div>
              </ng-container>

              <ng-container *ngIf="!authService.isAdmin()">
                <div class="p-3 rounded-lg bg-brand-surface border border-brand-border text-xs mb-3 space-y-1">
                  <div class="flex items-center justify-between text-brand-text-secondary">
                    <span>Entrega para:</span>
                    <strong class="text-brand-text-primary">{{ authService.currentUser()?.fullName }}</strong>
                  </div>
                  <div class="flex items-center justify-between text-brand-text-secondary">
                    <span>Dirección:</span>
                    <span class="truncate max-w-[200px] font-medium text-brand-text-primary">
                      {{ authService.currentUser()?.address || 'Av. Javier Prado Este 1234' }}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  (click)="openCheckout()"
                  class="w-full py-3.5 px-4 bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-bold rounded-xl shadow-card transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <app-icon name="check" [size]="18"></app-icon>
                  <span>Continuar al Pago y Entrega</span>
                </button>
              </ng-container>
            </div>

            <ng-template #requireLoginTpl>
              <button
                type="button"
                (click)="requestAuth.emit()"
                class="w-full py-3.5 px-4 bg-brand-secondary hover:bg-brand-secondary-hover text-white text-sm font-bold rounded-xl shadow-card transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <app-icon name="user" [size]="18"></app-icon>
                <span>Iniciar Sesión como Cliente</span>
              </button>
              <p class="text-[11px] text-center text-brand-text-muted">
                Identifícate con tu cuenta de cliente para registrar tu pedido y realizar el pago.
              </p>
            </ng-template>
          </div>
        </div>
      </div>
    </div>

    <app-checkout-modal
      [isOpen]="showCheckoutModal"
      (closeEvent)="showCheckoutModal = false"
      (orderCompleted)="onOrderCompleted($event)"
    ></app-checkout-modal>
  `
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
