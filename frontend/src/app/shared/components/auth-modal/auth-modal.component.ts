import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoginRequest, RegisterRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './auth-modal.component.html'
})
export class AuthModalComponent {
  @Output() closeEvent = new EventEmitter<void>();

  activeTab: 'login' | 'register' = 'login';
  isLoading = false;
  isSuccess = false;
  successTitle = '';
  errorMessage = '';
  successMessage = '';

  loginForm: LoginRequest = {
    username: '',
    password: ''
  };

  registerForm: RegisterRequest = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  };

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastService: ToastService
  ) {}

  // envia formulario de inicio de sesion
  handleLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.loginForm).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.successTitle = '¡Inicio de Sesión Exitoso!';
        this.successMessage = `Bienvenido(a), ${user.fullName}. Redirigiendo a inicio...`;
        this.toastService.savePendingToast({
          message: `¡Bienvenido(a), ${user.fullName}!`,
          type: 'success'
        });
        setTimeout(() => {
          this.close();
          // reinicia la pagina y redirige a home
          window.location.href = '/';
        }, 1200);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Usuario o contraseña incorrectos. Verifica tus datos.';
      }
    });
  }

  // registra nuevo usuario cliente
  handleRegister(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerForm).subscribe({
      next: () => {
        this.authService.login({
          username: this.registerForm.username,
          password: this.registerForm.password
        }).subscribe({
          next: (user) => {
            this.isLoading = false;
            this.isSuccess = true;
            this.successTitle = '¡Cuenta Creada con Éxito!';
            this.successMessage = `Bienvenido(a), ${user.fullName}. Redirigiendo a inicio...`;
            this.toastService.savePendingToast({
              message: `¡Cuenta creada con éxito! Bienvenido(a), ${user.fullName}.`,
              type: 'success'
            });
            setTimeout(() => {
              this.close();
              // reinicia la pagina y redirige a home
              window.location.href = '/';
            }, 1200);
          },
          error: () => {
            this.isLoading = false;
            this.isSuccess = true;
            this.successTitle = '¡Registro Completado!';
            this.successMessage = 'Tu cuenta fue creada exitosamente. Redirigiendo a inicio...';
            this.toastService.savePendingToast({
              message: '¡Cuenta registrada con éxito! Ya puedes iniciar sesión.',
              type: 'success'
            });
            setTimeout(() => {
              this.close();
              window.location.href = '/';
            }, 1200);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Error al registrar la cuenta. El usuario o correo ya podría existir.';
      }
    });
  }

  // cierra modal de autenticacion
  close(): void {
    this.closeEvent.emit();
  }
}
