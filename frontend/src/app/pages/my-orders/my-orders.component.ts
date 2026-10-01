import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';
import { OrderService, CustomerOrder } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, AuthModalComponent],
  templateUrl: './my-orders.component.html'
})
export class MyOrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  readonly authService = inject(AuthService);

  readonly orders = signal<CustomerOrder[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly showAuthModal = signal<boolean>(false);

  searchQuery = '';
  readonly isSearching = signal<boolean>(false);
  readonly searchResult = signal<CustomerOrder | null>(null);
  readonly searchError = signal<string | null>(null);

  readonly cancellingOrderId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadOrders();
  }

  // consulta pedidos de cliente logueado
  loadOrders(): void {
    const isLogged = this.authService.isLoggedIn ? this.authService.isLoggedIn() : false;
    const isAdmin = this.authService.isAdmin ? this.authService.isAdmin() : false;

    if (!isLogged || isAdmin) {
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders.set(data || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('No se pudieron cargar tus pedidos en este momento.');
      }
    });
  }

  // gestiona cierre de modal de autenticacion
  onAuthModalClosed(): void {
    this.showAuthModal.set(false);
    if (this.authService.isLoggedIn() && !this.authService.isAdmin()) {
      this.loadOrders();
    }
  }

  // busca pedido por codigo de ticket
  handleSearchTicket(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      return;
    }

    this.isSearching.set(true);
    this.searchError.set(null);
    this.searchResult.set(null);

    this.orderService.trackOrder(query).subscribe({
      next: (order) => {
        this.searchResult.set(order);
        this.isSearching.set(false);
      },
      error: (err) => {
        this.isSearching.set(false);
        this.searchError.set(err?.error?.message || 'No se encontró ningún pedido con el ticket especificado.');
      }
    });
  }

  // restablece busqueda de ticket
  clearSearch(): void {
    this.searchQuery = '';
    this.searchResult.set(null);
    this.searchError.set(null);
  }

  // cancela pedido en estado pendiente
  handleCancelOrder(order: CustomerOrder): void {
    if (!confirm(`¿Estás seguro de que deseas cancelar el pedido ${order.orderNumber}?`)) {
      return;
    }

    this.cancellingOrderId.set(order.id);
    this.orderService.cancelOrder(order.id, 'Cancelado por solicitud del cliente').subscribe({
      next: () => {
        this.cancellingOrderId.set(null);
        this.orders.update(list => list.map(o => o.id === order.id ? { ...o, status: 'CANCELADO' } : o));
        const currentSearchResult = this.searchResult();
        if (currentSearchResult && currentSearchResult.id === order.id) {
          this.searchResult.set({ ...currentSearchResult, status: 'CANCELADO' });
        }
      },
      error: (err) => {
        this.cancellingOrderId.set(null);
        alert(err?.error?.message || 'No se pudo cancelar el pedido.');
      }
    });
  }

  // calcula paso numerico del estado para la barra
  getOrderStep(status: string): number {
    switch (status) {
      case 'PENDIENTE': return 1;
      case 'EN_COCINA': return 2;
      case 'EN_CAMINO': return 3;
      case 'ENTREGADO': return 4;
      default: return 0;
    }
  }

  // asigna estilos visuales segun estado
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

  // retorna texto amigable del estado
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
