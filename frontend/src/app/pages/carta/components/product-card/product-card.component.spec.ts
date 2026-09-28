import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Dish } from '../../../../core/models/dish.model';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockDish: Dish = {
    id: 1,
    name: '1 Pollo a la Brasa Tradicional',
    category: 'Brasas & Pollos',
    description: 'Delicioso pollo con papas y cremas.',
    price: 74.90,
    imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6',
    badgeText: 'Fórmula Secreta',
    prepTime: '20-25 min',
    servings: '3-4 personas',
    isStar: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.dish = mockDish;
    component.inCartQuantity = 0;
    fixture.detectChanges();
  });

  it('should create the product card', () => {
    expect(component).toBeTruthy();
  });

  it('should display dish name and price', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('1 Pollo a la Brasa Tradicional');
    expect(el.textContent).toContain('74.90');
    expect(el.textContent).toContain('Estrella');
  });

  it('should emit quickAdd when Agregar button is clicked', () => {
    let emittedDish: Dish | null = null;
    component.quickAdd.subscribe(d => {
      emittedDish = d;
    });

    const addButton = fixture.nativeElement.querySelector('button[aria-label^="Agregar"]');
    expect(addButton).toBeTruthy();

    addButton.click();
    expect(emittedDish).toEqual(mockDish);
  });

  it('should emit selectDish when title is clicked', () => {
    let selectedDish: Dish | null = null;
    component.selectDish.subscribe(d => {
      selectedDish = d;
    });

    const titleEl = fixture.nativeElement.querySelector('h3');
    titleEl.click();
    expect(selectedDish).toEqual(mockDish);
  });

  it('should show quantity stepper and emit updateQuantity when inCartQuantity > 0', () => {
    fixture.componentRef.setInput('inCartQuantity', 3);
    fixture.detectChanges();

    const emittedUpdates: Array<{ dish: Dish; delta: number }> = [];
    component.updateQuantity.subscribe(update => {
      emittedUpdates.push(update);
    });

    const buttons = fixture.nativeElement.querySelectorAll('button[aria-label="Aumentar cantidad"], button[aria-label="Disminuir cantidad"]');
    expect(buttons.length).toBe(2);

    buttons[0].click();
    buttons[1].click();

    expect(emittedUpdates.length).toBe(2);
    expect(emittedUpdates[0]).toEqual({ dish: mockDish, delta: -1 });
    expect(emittedUpdates[1]).toEqual({ dish: mockDish, delta: 1 });
  });
});
