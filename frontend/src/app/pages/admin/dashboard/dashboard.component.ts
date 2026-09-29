import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { BadgeComponent, BadgeVariant } from '../../../shared/components/badge/badge.component';
import { AdminService, DashboardStatsResponse, AdminOrder } from '../../../core/services/admin.service';

export interface TopDishItem {
  name: string;
  count: number;
  percentage: number;
  category: 'Brasas' | 'Wok';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, BadgeComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly stats = signal<DashboardStatsResponse | null>(null);
  readonly recentOrders = signal<AdminOrder[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  readonly topDishes = computed<TopDishItem[]>(() => {
    const s = this.stats();
    if (!s || !s.topDishes || s.topDishes.length === 0) {
      return [];
    }
    const maxCount = Math.max(...s.topDishes.map(d => d.quantity), 1);
    return s.topDishes.map(d => ({
      name: d.name,
      count: d.quantity,
      percentage: Math.round((d.quantity / maxCount) * 100),
      category: d.name.toLowerCase().includes('wok') || d.name.toLowerCase().includes('chaufa') ? 'Wok' : 'Brasas'
    }));
  });

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      stats: this.adminService.getDashboardStats(),
      orders: this.adminService.getOrders()
    }).subscribe({
      next: ({ stats, orders }) => {
        this.stats.set(stats);
        this.recentOrders.set(orders.slice(0, 6));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar la información del panel en este momento. Por favor verifica la conexión con el servidor.');
        this.isLoading.set(false);
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_COCINA': return 'En Cocina';
      case 'EN_CAMINO': return 'En Camino';
      case 'ENTREGADO': return 'Entregado';
      case 'CANCELADO': return 'Cancelado';
      default: return status;
    }
  }

  getStatusVariant(status: string): BadgeVariant {
    switch (status) {
      case 'PENDIENTE': return 'warning';
      case 'EN_COCINA': return 'warning';
      case 'EN_CAMINO': return 'info';
      case 'ENTREGADO': return 'success';
      case 'CANCELADO': return 'error';
      default: return 'neutral';
    }
  }

  getItemsSummary(order: AdminOrder): string {
    if (!order.items || order.items.length === 0) {
      return 'Sin items detallados';
    }
    return order.items.map(i => `${i.quantity}x ${i.productName}`).join(' + ');
  }
}
