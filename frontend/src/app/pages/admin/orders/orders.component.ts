import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AdminService, AdminOrder } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-brand-text-primary font-sans">
            Gestión de Pedidos & Comandas
          </h1>
          <p class="text-xs text-brand-text-secondary mt-0.5">
            Seguimiento de pedidos, estados de entrega y auditoría de cambios.
          </p>
        </div>

        <button
          type="button"
          (click)="loadOrders()"
          class="inline-flex items-center gap-2 px-3.5 py-2 bg-brand-surface border border-brand-border text-brand-text-primary text-xs font-semibold rounded-xl hover:bg-brand-surface-alt transition-colors shadow-subtle self-start sm:self-auto"
        >
          <app-icon name="dashboard" [size]="14"></app-icon>
          <span>Actualizar</span>
        </button>
      </div>

      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          *ngFor="let tab of statusTabs"
          type="button"
          (click)="onTabChange(tab)"
          [class.bg-brand-primary]="selectedStatus() === tab"
          [class.text-white]="selectedStatus() === tab"
          [class.border-brand-primary]="selectedStatus() === tab"
          [class.bg-brand-surface]="selectedStatus() !== tab"
          [class.text-brand-text-secondary]="selectedStatus() !== tab"
          class="px-3.5 py-2 rounded-xl text-xs font-bold border border-brand-border transition-all whitespace-nowrap shadow-subtle active:scale-95"
        >
          {{ getTabLabel(tab) }}
        </button>
      </div>

      <div *ngIf="isLoading()" class="p-12 text-center text-xs text-brand-text-secondary bg-brand-surface rounded-2xl border border-brand-border">
        <div class="inline-block w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mb-2"></div>
        <p>Cargando comandas desde el servidor...</p>
      </div>

      <div *ngIf="!isLoading() && orders().length === 0" class="p-12 text-center bg-brand-surface rounded-2xl border border-brand-border space-y-2">
        <div class="w-12 h-12 rounded-xl bg-brand-surface-alt text-brand-text-muted flex items-center justify-center mx-auto">
          <app-icon name="orders" [size]="24"></app-icon>
        </div>
        <h3 class="text-sm font-bold text-brand-text-primary">No hay comandas en este estado</h3>
        <p class="text-xs text-brand-text-secondary">Selecciona otra pestaña o actualiza la lista.</p>
      </div>

      <div *ngIf="!isLoading() && orders().length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <article
          *ngFor="let order of orders()"
          class="bg-brand-surface rounded-2xl border border-brand-border p-5 shadow-card hover:border-brand-primary/40 transition-all flex flex-col justify-between space-y-4"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between pb-3 border-b border-brand-border">
              <div>
                <span class="text-base font-extrabold font-mono text-brand-text-primary block">
                  #{{ order.orderNumber }}
                </span>
                <span class="text-[11px] text-brand-text-muted">
                  {{ order.paymentMethod }} • S/ {{ order.totalAmount.toFixed(2) }}
                </span>
              </div>

              <span
                class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1"
                [ngClass]="{
                  'bg-amber-500/10 text-amber-500 border border-amber-500/30': order.status === 'PENDIENTE',
                  'bg-brand-primary/10 text-brand-primary border border-brand-primary/30': order.status === 'EN_COCINA',
                  'bg-sky-500/10 text-sky-400 border border-sky-500/30': order.status === 'EN_CAMINO',
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30': order.status === 'ENTREGADO',
                  'bg-rose-500/10 text-rose-400 border border-rose-500/30': order.status === 'CANCELADO'
                }"
              >
                <app-icon name="flame" [size]="12"></app-icon>
                <span>{{ order.status }}</span>
              </span>
            </div>

            <div class="space-y-1 text-xs">
              <div class="flex justify-between text-brand-text-secondary">
                <span>Cliente:</span>
                <strong class="text-brand-text-primary">{{ order.customerName }}</strong>
              </div>
              <div class="flex justify-between text-brand-text-secondary">
                <span>Teléfono:</span>
                <span class="font-mono text-brand-text-primary">{{ order.deliveryPhone }}</span>
              </div>
              <div class="text-brand-text-secondary pt-1">
                <span class="block text-brand-text-muted text-[10px] uppercase font-semibold">Dirección:</span>
                <span class="text-brand-text-primary">{{ order.deliveryAddress }}</span>
              </div>
              <div *ngIf="order.deliveryNotes" class="p-2 bg-brand-surface-alt rounded-lg text-brand-accent text-[11px] italic">
                "{{ order.deliveryNotes }}"
              </div>
            </div>

            <div class="pt-2 border-t border-brand-border/60">
              <span class="text-[10px] uppercase tracking-wider font-bold text-brand-text-muted block mb-1.5">
                Platos de la Comanda
              </span>
              <ul class="space-y-1 text-xs text-brand-text-primary">
                <li *ngFor="let item of order.items" class="flex justify-between">
                  <span>{{ item.quantity }}x {{ item.productName }}</span>
                  <span class="font-mono text-brand-text-secondary">S/ {{ item.subtotal.toFixed(2) }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="pt-3 border-t border-brand-border flex items-center justify-between gap-2">
            <button
              type="button"
              (click)="viewLogs(order)"
              class="px-2.5 py-1.5 text-brand-text-muted hover:text-brand-text-primary text-[11px] font-semibold rounded-lg hover:bg-brand-surface-alt transition-colors"
            >
              Auditoría
            </button>

            <div class="flex items-center gap-1.5">
              <button
                *ngIf="order.status === 'PENDIENTE'"
                type="button"
                (click)="changeStatus(order, 'EN_COCINA')"
                class="px-3 py-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-lg shadow-card transition-all active:scale-95"
              >
                A Cocina →
              </button>

              <button
                *ngIf="order.status === 'EN_COCINA'"
                type="button"
                (click)="changeStatus(order, 'EN_CAMINO')"
                class="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg shadow-card transition-all active:scale-95"
              >
                Despachar →
              </button>

              <div *ngIf="order.status === 'EN_CAMINO'" class="flex items-center gap-1.5">
                <button
                  type="button"
                  (click)="changeStatus(order, 'EN_COCINA', 'Corrección: retornado a cocina por error de despacho')"
                  class="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/30 text-xs font-semibold rounded-lg transition-all active:scale-95"
                  title="Corregir error y retornar la comanda a cocina"
                >
                  ← Revertir a Cocina
                </button>
                <button
                  type="button"
                  (click)="changeStatus(order, 'ENTREGADO')"
                  class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-card transition-all active:scale-95"
                >
                  Entregado ✓
                </button>
              </div>

              <button
                *ngIf="order.status === 'PENDIENTE' || order.status === 'EN_COCINA'"
                type="button"
                (click)="changeStatus(order, 'CANCELADO')"
                class="px-2 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </article>
      </div>

      <div *ngIf="selectedOrderForLogs()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-secondary/70 backdrop-blur-sm">
        <div class="bg-brand-surface rounded-2xl border border-brand-border p-6 max-w-md w-full shadow-dropdown space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-brand-border">
            <h3 class="text-sm font-bold text-brand-text-primary">
              Historial de Auditoría • #{{ selectedOrderForLogs()!.orderNumber }}
            </h3>
            <button (click)="selectedOrderForLogs.set(null)" class="text-brand-text-muted hover:text-brand-text-primary">
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>

          <div *ngIf="orderLogs().length === 0" class="text-xs text-brand-text-secondary py-4 text-center">
            Sin registros adicionales.
          </div>

          <ul *ngIf="orderLogs().length > 0" class="space-y-3 text-xs">
            <li *ngFor="let log of orderLogs()" class="p-2.5 rounded-xl bg-brand-surface-alt border border-brand-border space-y-1">
              <div class="flex justify-between font-bold text-brand-text-primary">
                <span>{{ log.previousStatus || 'INICIO' }} → {{ log.newStatus }}</span>
                <span class="text-[10px] text-brand-text-muted font-normal">{{ log.createdAt | date:'shortTime' }}</span>
              </div>
              <p *ngIf="log.comment" class="text-[11px] text-brand-text-secondary">{{ log.comment }}</p>
              <span class="text-[10px] text-brand-text-muted">Por: {{ log.changedByUsername || 'Sistema' }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toastService = inject(ToastService);

  readonly statusTabs = ['TODOS', 'PENDIENTE', 'EN_COCINA', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'];
  readonly selectedStatus = signal<string>('TODOS');
  readonly orders = signal<AdminOrder[]>([]);
  readonly isLoading = signal<boolean>(true);

  readonly selectedOrderForLogs = signal<AdminOrder | null>(null);
  readonly orderLogs = signal<any[]>([]);

  ngOnInit(): void {
    this.loadOrders();
  }

  onTabChange(tab: string): void {
    this.selectedStatus.set(tab);
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.adminService.getOrders(this.selectedStatus()).subscribe({
      next: (orders) => {
        this.orders.set(orders || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getTabLabel(status: string): string {
    switch (status) {
      case 'TODOS': return 'Todas';
      case 'PENDIENTE': return 'Pendientes';
      case 'EN_COCINA': return 'En Cocina';
      case 'EN_CAMINO': return 'En Camino';
      case 'ENTREGADO': return 'Entregados';
      case 'CANCELADO': return 'Cancelados';
      default: return status;
    }
  }

  // actualiza estado de comanda con comentario opcional
  changeStatus(order: AdminOrder, nextStatus: string, comment?: string): void {
    this.adminService.updateOrderStatus(order.id, nextStatus, comment).subscribe({
      next: () => {
        this.orders.update(list => list.map(o => o.id === order.id ? { ...o, status: nextStatus as any } : o));
        this.toastService.success(`Comanda #${order.orderNumber}: Estado cambiado a ${nextStatus}`);
        if (this.selectedStatus() !== 'TODOS') {
          this.loadOrders();
        }
      },
      error: (err) => {
        this.toastService.error(err?.error?.message || 'No se pudo actualizar el estado de la comanda');
      }
    });
  }

  viewLogs(order: AdminOrder): void {
    this.selectedOrderForLogs.set(order);
    this.adminService.getOrderLogs(order.id).subscribe({
      next: (logs) => {
        this.orderLogs.set(logs || []);
      },
      error: () => {
        this.orderLogs.set([]);
      }
    });
  }
}
