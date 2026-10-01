import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created with initial null toast', () => {
    expect(service).toBeTruthy();
    expect(service.toast()).toBeNull();
  });

  it('should set toast on success call and dismiss manually', () => {
    service.success('Operación exitosa');
    expect(service.toast()).toEqual({ message: 'Operación exitosa', type: 'success' });

    service.dismiss();
    expect(service.toast()).toBeNull();
  });

  it('should set toast on info call', () => {
    service.info('Sesión cerrada');
    expect(service.toast()).toEqual({ message: 'Sesión cerrada', type: 'info' });
  });

  it('should set toast on error call', () => {
    service.error('Ocurrió un error');
    expect(service.toast()).toEqual({ message: 'Ocurrió un error', type: 'error' });
  });
});
