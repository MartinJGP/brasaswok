import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AuthService } from '../../../core/services/auth.service';
import { AuthModalComponent } from '../../../shared/components/auth-modal/auth-modal.component';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, AuthModalComponent],
  templateUrl: './forbidden.component.html'
})
export class ForbiddenComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  showLoginModal = false;

  // redirige segun el rol tras cerrar el modal
  onLoginClosed(): void {
    this.showLoginModal = false;
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.isCustomer()) {
      this.router.navigate(['/mis-pedidos']);
    }
  }
}
