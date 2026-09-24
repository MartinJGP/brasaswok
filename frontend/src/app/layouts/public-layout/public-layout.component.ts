import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { AuthModalComponent } from '../../shared/components/auth-modal/auth-modal.component';
import { CartDrawerComponent } from '../../shared/components/cart-drawer/cart-drawer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, IconComponent, AuthModalComponent, CartDrawerComponent],
  templateUrl: './public-layout.component.html'
})
export class PublicLayoutComponent {
  isMobileMenuOpen = false;
  showAuthModal = false;

  constructor(
    public readonly cartService: CartService,
    public readonly authService: AuthService
  ) {}

  openAuthModal(): void {
    this.showAuthModal = true;
    this.isMobileMenuOpen = false;
  }

  closeAuthModal(): void {
    this.showAuthModal = false;
  }

  logout(): void {
    this.authService.logout();
    this.isMobileMenuOpen = false;
  }
}
