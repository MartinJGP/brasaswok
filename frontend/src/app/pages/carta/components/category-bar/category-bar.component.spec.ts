import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryBarComponent } from './category-bar.component';
import { DishCategory } from '../../../../core/models/dish.model';

describe('CategoryBarComponent', () => {
  let component: CategoryBarComponent;
  let fixture: ComponentFixture<CategoryBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryBarComponent);
    component = fixture.componentInstance;
    component.categories = ['Todos', 'Brasas & Pollos', 'Wok & Salteados'];
    component.activeCategory = 'Todos';
    component.counts = { Todos: 11, 'Brasas & Pollos': 3, 'Wok & Salteados': 2 };
    fixture.detectChanges();
  });

  it('should create the category bar', () => {
    expect(component).toBeTruthy();
  });

  it('should emit categorySelect when category button is clicked', () => {
    let emittedCategory: DishCategory | null = null;
    component.categorySelect.subscribe(cat => {
      emittedCategory = cat;
    });

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(3);

    buttons[1].click();
    expect(emittedCategory).toBe('Brasas & Pollos');
  });

  it('should return appropriate icons for each category', () => {
    expect(component.getCategoryIcon('Brasas & Pollos')).toBe('flame');
    expect(component.getCategoryIcon('Wok & Salteados')).toBe('menu');
    expect(component.getCategoryIcon('Todos')).toBe('menu');
  });
});
