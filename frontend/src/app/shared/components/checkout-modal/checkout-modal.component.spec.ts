import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CheckoutModalComponent } from './checkout-modal.component';
import { CartService } from '../../../core/services/cart.service';

describe('CheckoutModalComponent', () => {
  let component: CheckoutModalComponent;
  let fixture: ComponentFixture<CheckoutModalComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [CheckoutModalComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutModalComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);

    cartService.addItem({
      id: 1,
      name: '1 Pollo a la Brasa Tradicional',
      price: 74.90,
      category: 'Brasas & Pollos'
    }, 1);

    component.isOpen = true;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the checkout modal', () => {
    expect(component).toBeTruthy();
  });

  it('should render card payment by default', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Gourmet Card');
  });

  it('should render Yape payment method when selected', () => {
    component.selectedMethod = 'YAPE_PLIN';
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Yapea o Plinea al instante');
    expect(el.textContent).toContain('987 654 321');
  });

  it('should render cash payment method when selected', () => {
    component.selectedMethod = 'EFECTIVO';
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Pago en Efectivo contra Entrega');
  });

  it('should process checkout and switch to success step', () => {
    component.deliveryAddress = 'Av. Javier Prado Este 1234';
    component.deliveryPhone = '987654321';
    component.processCheckout();

    expect(component.step === 'processing' || component.step === 'success').toBe(true);
  });
});
