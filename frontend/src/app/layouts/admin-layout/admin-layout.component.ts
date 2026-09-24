import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { NavItem } from '../../core/models/nav-item.model';

interface MenuGroup {
  section: string;
  items: NavItem[];
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  isMobileMenuOpen = false;

  readonly menuGroups: MenuGroup[] = [
    {
      section: 'Operaciones',
      items: [
        { label: 'Panel General', path: '/admin/dashboard', icon: 'dashboard' },
        { label: 'Cocina & Pedidos', path: '/admin/orders', icon: 'orders', badge: '8', badgeVariant: 'warning' },
        { label: 'Mesas & Salón', path: '/admin/tables', icon: 'tables' }
      ]
    },
    {
      section: 'Carta & Productos',
      items: [
        { label: 'Platos & Menú', path: '/admin/menu', icon: 'menu' },
        { label: 'Categorías', path: '/admin/categories', icon: 'categories' }
      ]
    },
    {
      section: 'Gestión & Reportes',
      items: [
        { label: 'Equipo & Usuarios', path: '/admin/users', icon: 'users' },
        { label: 'Métricas & Ventas', path: '/admin/reports', icon: 'reports' },
        { label: 'Configuración', path: '/admin/settings', icon: 'settings' }
      ]
    }
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
