import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { OrderService, CustomerOrder } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  templateUrl: './my-orders.component.html'
})
export class MyOrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  readonly authService = inject(AuthService);

  orders: CustomerOrder[] = [];
  isLoading = true;
  errorMessage = '';

  searchQuery = '';
  isSearching = false;
  searchResult: CustomerOrder | null = null;
  searchError = '';

  cancellingOrderId: number | null = null;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    if (!this.authService.isLoggedIn()) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'No se pudieron cargar tus pedidos en este momento.';
      }
    });
  }

  handleSearchTicket(): void {
    if (!this.searchQuery.trim()) {
      return;
    }

    this.isSearching = true;
    this.searchError = '';
    this.searchResult = null;

    this.orderService.trackOrder(this.searchQuery).subscribe({
      next: (order) => {
        this.searchResult = order;
        this.isSearching = false;
      },
      error: (err) => {
        this.isSearching = false;
        this.searchError = err?.error?.message || 'No se encontró ningún pedido con el ticket especificado.';
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResult = null;
    this.searchError = '';
  }

  handleCancelOrder(order: CustomerOrder): void {
    if (!confirm(`¿Estás seguro de que deseas cancelar el pedido ${order.orderNumber}?`)) {
      return;
    }

    this.cancellingOrderId = order.id;
    this.orderService.cancelOrder(order.id, 'Cancelado por solicitud del cliente').subscribe({
      next: (updated) => {
        this.cancellingOrderId = null;
        order.status = 'CANCELADO';
        if (this.searchResult && this.searchResult.id === order.id) {
          this.searchResult.status = 'CANCELADO';
        }
      },
      error: (err) => {
        this.cancellingOrderId = null;
        alert(err?.error?.message || 'No se pudo cancelar el pedido.');
      }
    });
  }

  getOrderStep(status: string): number {
    switch (status) {
      case 'PENDIENTE': return 1;
      case 'EN_COCINA': return 2;
      case 'EN_CAMINO': return 3;
      case 'ENTREGADO': return 4;
      default: return 0;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDIENTE':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/30';
      case 'EN_COCINA':
        return 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30';
      case 'EN_CAMINO':
        return 'bg-sky-500/10 text-sky-400 border border-sky-500/30';
      case 'ENTREGADO':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'CANCELADO':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-brand-surface-alt text-brand-text-secondary border border-brand-border';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_COCINA': return 'En Cocina (Wok & Brasas)';
      case 'EN_CAMINO': return 'En Camino (Delivery)';
      case 'ENTREGADO': return 'Entregado';
      case 'CANCELADO': return 'Cancelado';
      default: return status;
    }
  }
}
