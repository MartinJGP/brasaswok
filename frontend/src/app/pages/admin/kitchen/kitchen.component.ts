import { Component, OnInit, signal, computed, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AdminService, AdminOrder } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { WebSocketService } from '../../../core/services/websocket.service';

@Component({
  selector: 'app-admin-kitchen',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './kitchen.component.html'
})
export class AdminKitchenComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly toastService = inject(ToastService);
  private readonly wsService = inject(WebSocketService);
  private readonly destroyRef = inject(DestroyRef);

  readonly allOrders = signal<AdminOrder[]>([]);
  readonly isLoading = signal<boolean>(true);

  readonly activeKitchenOrders = computed(() => {
    return this.allOrders().filter(o => o.status === 'PENDIENTE' || o.status === 'EN_COCINA');
  });

  ngOnInit(): void {
    this.loadKitchenOrders(true);
    this.initRealtimeListeners();
  }

  // escucha eventos websocket y respaldo periodico
  private initRealtimeListeners(): void {
    this.wsService.onAdminEvents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event?.message) {
          this.toastService.info(event.message);
        }
        this.loadKitchenOrders(false);
      });

    interval(5000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadKitchenOrders(false);
      });
  }

  // carga comandas de cocina sin parpadeo visual
  loadKitchenOrders(showSpinner = true): void {
    if (showSpinner) {
      this.isLoading.set(true);
    }
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
