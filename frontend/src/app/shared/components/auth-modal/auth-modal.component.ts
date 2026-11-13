import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
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
  errorDetails: string[] = [];
  successMessage = '';
  showPassword = false;

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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  setTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.errorDetails = [];
    this.successMessage = '';
  }

  // valida y envía formulario de inicio de sesión
  handleLogin(): void {
    this.errorMessage = '';
    this.errorDetails = [];

    const username = this.loginForm.username?.trim();
    const password = this.loginForm.password;

    if (!username) {
      this.errorMessage = 'Por favor ingresa tu usuario o correo electrónico.';
      return;
    }
    if (!password) {
      this.errorMessage = 'Por favor ingresa tu contraseña de acceso.';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';

    this.authService.login({ username, password }).subscribe({
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
          window.location.href = '/';
        }, 1100);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Credenciales incorrectas. Verifica que tu usuario y contraseña sean correctos.';
        } else if (err.status === 403) {
          this.errorMessage = 'Tu cuenta se encuentra inactiva o suspendida. Por favor comunícate con administración.';
        } else if (err.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor de autenticación. Verifica tu conexión a internet o el estado del backend.';
        } else {
          this.errorMessage = err?.error?.message || 'Error al iniciar sesión. Por favor verifica los datos ingresados.';
        }
      }
    });
  }

  // valida y registra nuevo usuario cliente con manejo granular de excepciones
  handleRegister(): void {
    this.errorMessage = '';
    this.errorDetails = [];

    const fullName = this.registerForm.fullName?.trim();
    const username = this.registerForm.username?.trim();
    const email = this.registerForm.email?.trim();
    const password = this.registerForm.password;
    const phone = this.registerForm.phone?.trim();
    const address = this.registerForm.address?.trim();

    // Validaciones preventivas de UX en frontend
    const localErrors: string[] = [];
    if (!fullName || fullName.length < 3) {
      localErrors.push('El nombre completo debe tener al menos 3 caracteres.');
    }
    if (!username || username.length < 3) {
      localErrors.push('El nombre de usuario debe tener mínimo 3 caracteres alfanuméricos.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      localErrors.push('Ingresa un correo electrónico con formato válido (ejemplo: usuario@correo.com).');
    }
    if (!password || password.length < 6) {
      localErrors.push('La contraseña debe tener un mínimo de 6 caracteres para mayor seguridad.');
    }

    if (localErrors.length > 0) {
      this.errorMessage = 'Por favor corrige los siguientes campos antes de continuar:';
      this.errorDetails = localErrors;
      return;
    }

    this.isLoading = true;
    this.successMessage = '';

    const payload: RegisterRequest = {
      fullName,
      username,
      email,
      password,
      phone: phone || '',
      address: address || ''
    };

    this.authService.register(payload).subscribe({
      next: () => {
        // Auto-login tras registro exitoso
        this.authService.login({ username, password }).subscribe({
          next: (user) => {
            this.isLoading = false;
            this.isSuccess = true;
            this.successTitle = '¡Cuenta Creada con Éxito!';
            this.successMessage = `Bienvenido(a), ${user.fullName}. Iniciando tu sesión...`;
            this.toastService.savePendingToast({
              message: `¡Cuenta creada con éxito! Bienvenido(a), ${user.fullName}.`,
              type: 'success'
            });
            setTimeout(() => {
              this.close();
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
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        if (err.status === 400) {
          // Errores de validación devueltos por el backend
          if (Array.isArray(err.error?.errors) && err.error.errors.length > 0) {
            this.errorMessage = 'Errores de validación en el registro:';
            this.errorDetails = err.error.errors;
          } else if (err.error?.message?.includes('usuario ya está en uso') || err.error?.message?.includes('already in use')) {
            this.errorMessage = 'El nombre de usuario ya está registrado por otro cliente. Por favor elige otro.';
          } else if (err.error?.message?.includes('email ya está') || err.error?.message?.includes('correo ya')) {
            this.errorMessage = 'El correo electrónico ya tiene una cuenta asociada. ¿Deseas iniciar sesión?';
          } else {
            this.errorMessage = err.error?.message || 'Los datos ingresados no son válidos. Revisa cada campo.';
          }
        } else if (err.status === 409) {
          this.errorMessage = 'El usuario o correo electrónico ya se encuentra registrado. Inicia sesión con tus credenciales.';
        } else if (err.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión de red o el servicio backend.';
        } else {
          this.errorMessage = err?.error?.message || 'Ocurrió un error inesperado al procesar el registro. Inténtalo nuevamente.';
        }
      }
    });
  }

  close(): void {
    this.closeEvent.emit();
  }
}
