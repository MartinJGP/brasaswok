import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MyOrdersComponent } from './my-orders.component';
import { OrderService, CustomerOrder } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';

describe('MyOrdersComponent', () => {
  let component: MyOrdersComponent;
  let fixture: ComponentFixture<MyOrdersComponent>;

  const mockOrders: CustomerOrder[] = [
    {
      id: 1,
      orderNumber: 'BW-1001',
      customerId: 2,
      customerName: 'Cliente Test',
      customerPhone: '999888777',
      status: 'PENDIENTE',
      paymentMethod: 'TARJETA',
      deliveryAddress: 'Av. Test 123',
      deliveryPhone: '999888777',
      subtotal: 50.00,
      deliveryFee: 5.00,
      totalAmount: 55.00,
      createdAt: '2026-09-29T10:00:00Z',
      items: [
        {
          id: 10,
          productId: 1,
          productName: '1/2 Pollo a la Brasa',
          unitPrice: 50.00,
          quantity: 1,
          subtotal: 50.00
        }
      ]
    }
  ];

  const mockOrderService = {
    getMyOrders: () => of(mockOrders),
    trackOrder: (code: string) => of(mockOrders[0]),
    cancelOrder: (id: number, reason?: string) => of({ ...mockOrders[0], status: 'CANCELADO' as const })
  };

  const mockAuthService = {
    isLoggedIn: () => true,
    currentUser: () => ({ id: 2, fullName: 'Cliente Test', email: 'test@brasaswok.pe' }),
    logout: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyOrdersComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: OrderService, useValue: mockOrderService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and load orders for logged in user', () => {
    expect(component).toBeTruthy();
    expect(component.orders.length).toBe(1);
    expect(component.orders[0].orderNumber).toBe('BW-1001');
  });

  it('should correctly calculate order progress step', () => {
    expect(component.getOrderStep('PENDIENTE')).toBe(1);
    expect(component.getOrderStep('EN_COCINA')).toBe(2);
    expect(component.getOrderStep('EN_CAMINO')).toBe(3);
    expect(component.getOrderStep('ENTREGADO')).toBe(4);
    expect(component.getOrderStep('CANCELADO')).toBe(0);
  });

  it('should track order by ticket', () => {
    component.searchQuery = 'BW-1001';
    component.handleSearchTicket();
    expect(component.searchResult).toBeTruthy();
    expect(component.searchResult?.orderNumber).toBe('BW-1001');
  });
});
