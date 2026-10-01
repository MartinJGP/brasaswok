import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AdminService, AdminOrder } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-kitchen',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './kitchen.component.html'
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
