import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { NavItem } from '../../core/models/nav-item.model';
import { AuthService } from '../../core/services/auth.service';

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
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isMobileMenuOpen = false;

  readonly menuGroups: MenuGroup[] = [
    {
      section: 'Operaciones',
      items: [
        { label: 'Panel General', path: '/admin/dashboard', icon: 'dashboard' },
        { label: 'Cocina en Vivo', path: '/admin/kitchen', icon: 'flame', badge: 'KDS', badgeVariant: 'warning' },
        { label: 'Pedidos & Comandas', path: '/admin/orders', icon: 'orders' }
      ]
    },
    {
      section: 'Carta & Catálogo',
      items: [
        { label: 'Platos & Menú', path: '/admin/menu', icon: 'menu' },
        { label: 'Categorías', path: '/admin/categories', icon: 'categories' }
      ]
    }
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
