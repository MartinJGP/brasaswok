import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartaComponent } from './carta.component';
import { CartService } from '../../core/services/cart.service';

describe('CartaComponent', () => {
  let component: CartaComponent;
  let fixture: ComponentFixture<CartaComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [CartaComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(CartaComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should list all dishes by default', () => {
    expect(component.filteredDishes().length).toBe(11);
    expect(component.selectedCategory()).toBe('Todos');
  });

  it('should filter dishes when category changes', () => {
    component.onCategorySelect('Brasas & Pollos');
    fixture.detectChanges();

    expect(component.selectedCategory()).toBe('Brasas & Pollos');
    expect(component.filteredDishes().length).toBe(3);
    expect(component.filteredDishes().every(d => d.category === 'Brasas & Pollos')).toBe(true);
  });

  it('should filter dishes by search term in real time', () => {
    component.onSearchChange('chaufa');
    fixture.detectChanges();

    expect(component.filteredDishes().length).toBe(2);
    expect(component.filteredDishes().some(d => d.name.includes('Chaufa'))).toBe(true);
  });

  it('should clear search term properly', () => {
    component.onSearchChange('lomo');
    expect(component.filteredDishes().length).toBe(2);

    component.clearSearch();
    expect(component.searchTerm()).toBe('');
    expect(component.filteredDishes().length).toBe(11);
  });

  it('should open and close the dish modal', () => {
    const dish = component.filteredDishes()[0];
    component.openDishModal(dish);

    expect(component.activeDishForModal()).toEqual(dish);

    component.closeDishModal();
    expect(component.activeDishForModal()).toBeNull();
  });

  it('should add dish directly via onQuickAdd', () => {
    const dish = component.filteredDishes()[0];
    component.onQuickAdd(dish);

    expect(cartService.totalCount()).toBe(1);
    expect(component.getDishCartQuantity(dish.id)).toBe(1);
  });

  it('should update dish quantity via onUpdateQuantity', () => {
    const dish = component.filteredDishes()[0];
    component.onQuickAdd(dish);
    component.onUpdateQuantity({ dish, delta: 1 });

    expect(component.getDishCartQuantity(dish.id)).toBe(2);

    component.onUpdateQuantity({ dish, delta: -1 });
    expect(component.getDishCartQuantity(dish.id)).toBe(1);
  });

  it('should add dish with customization notes', () => {
    const dish = component.filteredDishes()[1];
    component.onAddDishWithCustomization({
      dish,
      quantity: 2,
      notes: 'Papas bien doradas y ají extra'
    });

    expect(cartService.totalCount()).toBe(2);
    const added = cartService.items().find(i => i.productId === dish.id);
    expect(added?.notes).toBe('Papas bien doradas y ají extra');
  });
});
