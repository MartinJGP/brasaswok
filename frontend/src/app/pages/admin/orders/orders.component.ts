import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AdminService, AdminOrder } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { WebSocketService } from '../../../core/services/websocket.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './orders.component.html'
})
export class AdminOrdersComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toastService = inject(ToastService);
  private readonly wsService = inject(WebSocketService);
  private readonly destroyRef = inject(DestroyRef);

  readonly statusTabs = ['TODOS', 'PENDIENTE', 'EN_COCINA', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'];
  readonly selectedStatus = signal<string>('TODOS');
  readonly orders = signal<AdminOrder[]>([]);
  readonly isLoading = signal<boolean>(true);

  readonly selectedOrderForLogs = signal<AdminOrder | null>(null);
  readonly orderLogs = signal<any[]>([]);

  ngOnInit(): void {
    this.loadOrders(true);
    this.initRealtimeListeners();
  }

  // escucha eventos en vivo y respaldo en segundo plano
  private initRealtimeListeners(): void {
    this.wsService.onAdminEvents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadOrders(false);
      });

    interval(6000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadOrders(false);
      });
  }

  onTabChange(tab: string): void {
    this.selectedStatus.set(tab);
    this.loadOrders(true);
  }

  // carga comandas con opcion de no parpadear
  loadOrders(showSpinner = true): void {
    if (showSpinner) {
      this.isLoading.set(true);
    }
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
          this.loadOrders(false);
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
