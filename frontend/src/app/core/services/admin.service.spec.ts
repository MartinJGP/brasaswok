import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { AdminService, AdminOrder, AdminProduct, AdminCategory, DashboardStatsResponse } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;

  const mockOrders: AdminOrder[] = [
    {
      id: 101,
      orderNumber: 'BW-1001',
      customerId: 1,
      customerName: 'Cliente Test',
      customerPhone: '999888777',
      deliveryAddress: 'Av. Test 123',
      deliveryPhone: '999888777',
      status: 'PENDIENTE',
      paymentMethod: 'TARJETA',
      subtotal: 50.0,
      deliveryFee: 5.0,
      totalAmount: 55.0,
      createdAt: '2026-09-29T10:00:00Z'
    },
    {
      id: 102,
      orderNumber: 'BW-1002',
      customerId: 2,
      customerName: 'Cliente Dos',
      customerPhone: '999888666',
      deliveryAddress: 'Calle Dos 456',
      deliveryPhone: '999888666',
      status: 'EN_COCINA',
      paymentMethod: 'EFECTIVO',
      subtotal: 40.0,
      deliveryFee: 5.0,
      totalAmount: 45.0,
      createdAt: '2026-09-29T10:10:00Z'
    }
  ];

  const mockProducts: AdminProduct[] = [
    {
      id: 1,
      name: 'Pollo a la Brasa',
      description: 'Delicioso pollo',
      price: 65.0,
      categoryId: 1,
      isAvailable: true
    }
  ];

  const mockCategories: AdminCategory[] = [
    {
      id: 1,
      name: 'Brasas & Pollos',
      description: 'Tradición al carbón',
      isActive: true
    }
  ];

  const mockStats: DashboardStatsResponse = {
    todaySales: 100.0,
    activeOrders: 2,
    averageTicket: 50.0,
    totalOrdersToday: 2,
    ordersByStatus: { PENDIENTE: 1, EN_COCINA: 1 },
    topDishes: [{ name: 'Pollo a la Brasa', quantity: 2 }]
  };

  const mockHttpClient = {
    get: (url: string) => {
      if (url.includes('/orders')) return of(mockOrders);
      if (url.includes('/products')) return of(mockProducts);
      if (url.includes('/categories')) return of(mockCategories);
      if (url.includes('/dashboard/stats')) return of(mockStats);
      return of([]);
    },
    post: (_url: string, body: any) => of({ id: 99, ...body }),
    put: (_url: string, body: any) => of(body),
    patch: (url: string, body: any) => {
      if (url.includes('/status')) return of({ ...mockOrders[0], status: body.status });
      if (url.includes('/toggle-availability')) return of({ ...mockProducts[0], isAvailable: false });
      if (url.includes('/toggle-status')) return of({ ...mockCategories[0], isActive: false });
      return of(body);
    },
    delete: () => of(void 0)
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

  it('should return orders list from backend', async () => {
    const orders = await firstValueFrom(service.getOrders());
    expect(orders.length).toBe(2);
    expect(orders[0].orderNumber).toBe('BW-1001');
  });

  it('should update order status via API', async () => {
    const updated = await firstValueFrom(service.updateOrderStatus(101, 'EN_COCINA'));
    expect(updated.status).toBe('EN_COCINA');
  });

  it('should return products and toggle availability', async () => {
    const products = await firstValueFrom(service.getProducts());
    expect(products.length).toBe(1);

    const toggled = await firstValueFrom(service.toggleProductAvailability(products[0].id));
    expect(toggled.isAvailable).toBe(false);
  });

  it('should return categories and toggle status', async () => {
    const categories = await firstValueFrom(service.getCategories());
    expect(categories.length).toBe(1);

    const toggled = await firstValueFrom(service.toggleCategoryStatus(categories[0].id));
    expect(toggled.isActive).toBe(false);
  });

  it('should fetch dashboard stats', async () => {
    const stats = await firstValueFrom(service.getDashboardStats());
    expect(stats.todaySales).toBe(100.0);
    expect(stats.activeOrders).toBe(2);
  });
});
