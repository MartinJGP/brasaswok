import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AdminService, AdminOrder } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-kitchen',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[11px] font-bold uppercase tracking-wider mb-1">
            <app-icon name="flame" [size]="12"></app-icon>
            <span>KDS • Pantalla de Cocina</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-brand-text-primary font-sans">
            Comandas al Fuego & Salteados
          </h1>
          <p class="text-xs text-brand-text-secondary">
            Cola prioritaria para parrilleros y maestros del wok.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-brand-surface border border-brand-border text-brand-text-primary shadow-subtle">
            {{ activeKitchenOrders().length }} comandas activas
          </span>
          <button
            type="button"
            (click)="loadKitchenOrders()"
            class="px-3.5 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-card flex items-center gap-1.5"
          >
            <app-icon name="dashboard" [size]="14"></app-icon>
            <span>Actualizar Cola</span>
          </button>
        </div>
      </div>

      <div *ngIf="isLoading()" class="p-12 text-center text-xs text-brand-text-secondary bg-brand-surface rounded-2xl border border-brand-border">
        <div class="inline-block w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mb-2"></div>
        <p>Sincronizando comandas de cocina...</p>
      </div>

      <div *ngIf="!isLoading() && activeKitchenOrders().length === 0" class="p-12 text-center bg-brand-surface rounded-2xl border border-brand-border space-y-3">
        <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
          <app-icon name="check" [size]="28"></app-icon>
        </div>
        <h3 class="text-base font-bold text-brand-text-primary">¡Cocina al día!</h3>
        <p class="text-xs text-brand-text-secondary max-w-sm mx-auto">
          No hay comandas pendientes de cocción en este momento. Las nuevas órdenes aparecerán automáticamente.
        </p>
      </div>

      <div *ngIf="!isLoading() && activeKitchenOrders().length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <div
          *ngFor="let order of activeKitchenOrders()"
          class="bg-brand-surface rounded-2xl border-2 overflow-hidden shadow-card flex flex-col justify-between"
          [ngClass]="order.status === 'EN_COCINA' ? 'border-brand-primary/60' : 'border-amber-500/40'"
        >
          <div class="p-5 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-brand-border">
              <div>
                <span class="text-lg font-mono font-extrabold text-brand-text-primary">#{{ order.orderNumber }}</span>
                <span class="text-[11px] text-brand-text-muted block">{{ order.createdAt | date:'shortTime' }}</span>
              </div>

              <span
                class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1"
                [ngClass]="order.status === 'EN_COCINA' ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30' : 'bg-amber-500/20 text-amber-600 border border-amber-500/30'"
              >
                <app-icon name="flame" [size]="12"></app-icon>
                <span>{{ order.status === 'EN_COCINA' ? 'Al Fuego' : 'Ingresado' }}</span>
              </span>
            </div>

            <div class="space-y-2">
              <span class="text-[10px] uppercase font-bold text-brand-text-muted tracking-wider block">
                Platos a Preparar
              </span>
              <div class="space-y-2 bg-brand-surface-alt/60 p-3 rounded-xl border border-brand-border/60">
                <div *ngFor="let item of order.items" class="text-xs">
                  <div class="flex items-center justify-between font-bold">
                    <span class="text-brand-primary text-sm font-mono">{{ item.quantity }}x</span>
                    <span class="text-brand-text-primary flex-1 ml-2 font-semibold">{{ item.productName }}</span>
                  </div>
                  <p *ngIf="item.notes" class="text-[11px] text-brand-accent italic mt-0.5 ml-6 bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">
                    Nota: "{{ item.notes }}"
                  </p>
                </div>
              </div>
            </div>

            <div *ngIf="order.deliveryNotes" class="p-2.5 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-xs text-brand-primary">
              <strong class="block text-[10px] uppercase">Instrucción General:</strong>
              {{ order.deliveryNotes }}
            </div>
          </div>

          <div class="p-4 bg-brand-surface-alt/50 border-t border-brand-border flex items-center justify-between gap-3">
            <span class="text-xs text-brand-text-secondary truncate max-w-[130px] font-medium">
              {{ order.customerName }}
            </span>

            <div class="flex items-center gap-2">
              <button
                *ngIf="order.status === 'PENDIENTE'"
                type="button"
                (click)="advanceStatus(order, 'EN_COCINA')"
                class="px-3.5 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-card flex items-center gap-1 active:scale-95"
              >
                <app-icon name="flame" [size]="13"></app-icon>
                <span>Poner al Fuego</span>
              </button>

              <div *ngIf="order.status === 'EN_COCINA'" class="flex items-center gap-1.5">
                <button
                  type="button"
                  (click)="advanceStatus(order, 'PENDIENTE', 'Corrección: retornado a pendiente')"
                  class="px-2.5 py-2 bg-brand-surface border border-brand-border text-brand-text-muted hover:text-brand-text-primary text-xs font-semibold rounded-xl transition-all"
                  title="Regresar a estado pendiente"
                >
                  ← Pendiente
                </button>
                <button
                  type="button"
                  (click)="advanceStatus(order, 'EN_CAMINO')"
                  class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-card flex items-center gap-1 active:scale-95"
                >
                  <app-icon name="check" [size]="13"></app-icon>
                  <span>Listo / Despachar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminKitchenComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toastService = inject(ToastService);

  readonly allOrders = signal<AdminOrder[]>([]);
  readonly isLoading = signal<boolean>(true);

  readonly activeKitchenOrders = computed(() => {
    return this.allOrders().filter(o => o.status === 'PENDIENTE' || o.status === 'EN_COCINA');
  });

  ngOnInit(): void {
    this.loadKitchenOrders();
  }

  // carga comandas de cocina
  loadKitchenOrders(): void {
    this.isLoading.set(true);
    this.adminService.getOrders('TODOS').subscribe({
      next: (orders) => {
        this.allOrders.set(orders || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  // avanza o retrocede estado de comanda
  advanceStatus(order: AdminOrder, nextStatus: string, comment?: string): void {
    this.adminService.updateOrderStatus(order.id, nextStatus, comment).subscribe({
      next: () => {
        this.allOrders.update(list => list.map(o => o.id === order.id ? { ...o, status: nextStatus as any } : o));
        this.toastService.success(`Comanda #${order.orderNumber}: Estado ${nextStatus}`);
      },
      error: (err) => {
        this.toastService.error(err?.error?.message || 'Error al actualizar comanda');
      }
    });
  }
}
