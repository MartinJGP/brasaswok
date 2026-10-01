import { Injectable, signal } from '@angular/core';

export interface ToastData {
  message: string;
  type: 'success' | 'info' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly PENDING_KEY = 'brasas_pending_toast';
  private timer: any = null;

  readonly toast = signal<ToastData | null>(null);

  constructor() {
    this.checkPendingToast();
  }

  // revisa si habia un toast pendiente tras recarga de pagina
  private checkPendingToast(): void {
    if (typeof sessionStorage !== 'undefined') {
      const stored = sessionStorage.getItem(this.PENDING_KEY);
      if (stored) {
        sessionStorage.removeItem(this.PENDING_KEY);
        try {
          const data: ToastData = JSON.parse(stored);
          setTimeout(() => this.show(data.message, data.type), 200);
        } catch {}
      }
    }
  }

  // guarda toast para mostrar despues de recargar
  savePendingToast(toast: ToastData): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(this.PENDING_KEY, JSON.stringify(toast));
    }
  }

  // muestra toast con autocierre
  show(message: string, type: 'success' | 'info' | 'error' = 'success', duration = 3500): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.toast.set({ message, type });
    this.timer = setTimeout(() => {
      this.toast.set(null);
    }, duration);
  }

  // atajo para exito
  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  // atajo para informacion
  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  // atajo para error
  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  // cierra toast manualmente
  dismiss(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.toast.set(null);
  }
}
