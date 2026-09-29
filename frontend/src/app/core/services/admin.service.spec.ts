import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;

  const mockHttpClient = {
    get: () => throwError(() => new Error('Offline')),
    post: () => throwError(() => new Error('Offline')),
    put: () => throwError(() => new Error('Offline')),
    patch: () => throwError(() => new Error('Offline'))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminService,
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    });
    service = TestBed.inject(AdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return orders list', async () => {
    const orders = await firstValueFrom(service.getOrders());
    expect(orders.length).toBeGreaterThan(0);
    expect(orders[0].orderNumber).toBeDefined();
  });

  it('should filter orders by status', async () => {
    const orders = await firstValueFrom(service.getOrders('EN_COCINA'));
    expect(orders.every(o => o.status === 'EN_COCINA')).toBe(true);
  });

  it('should update order status', async () => {
    const updated = await firstValueFrom(service.updateOrderStatus(101, 'EN_COCINA'));
    expect(updated.status).toBe('EN_COCINA');
  });

  it('should return products and allow toggling availability', async () => {
    const products = await firstValueFrom(service.getProducts());
    expect(products.length).toBeGreaterThan(0);
    const initialAvailability = products[0].isAvailable;

    const toggled = await firstValueFrom(service.toggleProductAvailability(products[0].id));
    expect(toggled.isAvailable).toBe(!initialAvailability);
  });

  it('should return categories and allow toggling status', async () => {
    const categories = await firstValueFrom(service.getCategories());
    expect(categories.length).toBeGreaterThan(0);
    const initialStatus = categories[0].isActive;

    const toggled = await firstValueFrom(service.toggleCategoryStatus(categories[0].id));
    expect(toggled.isActive).toBe(!initialStatus);
  });
});
