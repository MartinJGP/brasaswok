import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, IconName } from '../../../shared/components/icon/icon.component';
import { BadgeComponent, BadgeVariant } from '../../../shared/components/badge/badge.component';

interface MetricItem {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  caption: string;
  icon: IconName;
  iconBg: string;
  iconColor: string;
}

interface RecentOrderItem {
  orderNumber: string;
  timeAgo: string;
  customer: string;
  destination: string;
  itemsSummary: string;
  itemsCount: number;
  total: number;
  paymentMethod: string;
  statusLabel: string;
  statusVariant: BadgeVariant;
}

interface TopDishItem {
  name: string;
  count: number;
  percentage: number;
  category: 'Brasas' | 'Wok';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IconComponent, BadgeComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  selectedPeriod = 'hoy';

  readonly periods = [
    { id: 'hoy', label: 'Hoy' },
    { id: 'semana', label: 'Esta Semana' },
    { id: 'mes', label: 'Este Mes' }
  ];

  readonly metrics: MetricItem[] = [
    {
      title: 'Ventas de Hoy',
      value: 'S/ 3,420.80',
      change: '+14.5%',
      isPositive: true,
      caption: 'vs. mismo día semana pasada',
      icon: 'dollar',
      iconBg: 'bg-brand-primary-light',
      iconColor: 'text-brand-primary'
    },
    {
      title: 'Comandas Activas',
      value: '8 en cocina',
      change: '+3 nuevas',
      isPositive: true,
      caption: '5 Brasas y 3 Salteados Wok',
      icon: 'flame',
      iconBg: 'bg-brand-accent-light',
      iconColor: 'text-brand-accent'
    },
    {
      title: 'Tiempo Promedio',
      value: '26 min',
      change: '-4 min',
      isPositive: true,
      caption: 'Meta de servicio < 35 min',
      icon: 'clock',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Ticket Promedio',
      value: 'S/ 68.40',
      change: '+5.2%',
      isPositive: true,
      caption: 'Promedio por pedido/mesa',
      icon: 'trending-up',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600'
    }
  ];

  readonly recentOrders: RecentOrderItem[] = [
    {
      orderNumber: 'BW-001',
      timeAgo: '8 min',
      customer: 'Carlos Mendoza',
      destination: 'Calle Los Pinos 432, San Isidro',
      itemsSummary: '1 Pollo a la Brasa Tradicional + Chicha Morada 1L',
      itemsCount: 2,
      total: 91.90,
      paymentMethod: 'Transferencia',
      statusLabel: 'En Cocina',
      statusVariant: 'warning'
    },
    {
      orderNumber: 'BW-002',
      timeAgo: '14 min',
      customer: 'Ana Torres',
      destination: 'Av. Primavera 789, Surco',
      itemsSummary: 'Lomo Saltado al Wok Criollo + Wantán Frito (12 und)',
      itemsCount: 2,
      total: 57.90,
      paymentMethod: 'Yape / Plin',
      statusLabel: 'En Cocina',
      statusVariant: 'warning'
    },
    {
      orderNumber: 'BW-003',
      timeAgo: '22 min',
      customer: 'Luis Navarro',
      destination: 'Av. El Polo 450, Monterrico',
      itemsSummary: 'Aeropuerto Fusión + Inka Kola 1.5L',
      itemsCount: 2,
      total: 45.90,
      paymentMethod: 'Tarjeta',
      statusLabel: 'En Camino',
      statusVariant: 'info'
    },
    {
      orderNumber: 'BW-004',
      timeAgo: '35 min',
      customer: 'Valeria Quispe',
      destination: 'Mesa 04 (Salón Principal)',
      itemsSummary: '1/2 Pollo a la Brasa + Tequeños Wok',
      itemsCount: 2,
      total: 63.90,
      paymentMethod: 'Efectivo',
      statusLabel: 'Entregado',
      statusVariant: 'success'
    },
    {
      orderNumber: 'BW-005',
      timeAgo: '42 min',
      customer: 'Diego Salazar',
      destination: 'Av. Benavides 1940, Miraflores',
      itemsSummary: 'Tallarín Saltado de Carne + 1/4 Pollo',
      itemsCount: 2,
      total: 61.80,
      paymentMethod: 'Transferencia',
      statusLabel: 'Entregado',
      statusVariant: 'success'
    }
  ];

  readonly topDishes: TopDishItem[] = [
    { name: '1 Pollo a la Brasa Tradicional', count: 42, percentage: 88, category: 'Brasas' },
    { name: 'Lomo Saltado al Wok Criollo', count: 31, percentage: 65, category: 'Wok' },
    { name: 'Arroz Chaufa Especial de Chancho', count: 27, percentage: 56, category: 'Wok' },
    { name: '1/2 Pollo a la Brasa', count: 24, percentage: 50, category: 'Brasas' },
    { name: 'Tequeños Wok de Pollo (8 und)', count: 19, percentage: 40, category: 'Wok' }
  ];
}
