import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;

  const mockProducts = [
    {
      id: 1,
      name: '1 Pollo a la Brasa Tradicional',
      description: 'Pollo entero marinado con papas fritas',
      price: 65.90,
      imageUrl: 'https://example.com/pollo.jpg',
      categoryName: 'Brasas & Pollos'
    },
    {
      id: 2,
      name: 'Lomo Saltado al Wok Criollo',
      description: 'Lomo fino salteado al fuego vivo',
      price: 42.50,
      imageUrl: 'https://example.com/lomo.jpg',
      categoryName: 'Wok & Salteados'
    }
  ];

  const mockCategories = [
    { id: 1, name: 'Brasas & Pollos' },
    { id: 2, name: 'Wok & Salteados' }
  ];

  const mockHttpClient = {
    get: (url: string) => {
      if (url.includes('/products')) return of(mockProducts);
      if (url.includes('/categories')) return of(mockCategories);
      return of([]);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MenuService,
        { provide: HttpClient, useValue: mockHttpClient }
      ]
    });
    service = TestBed.inject(MenuService);
  });

  it('should be created and load dishes from backend', () => {
    expect(service).toBeTruthy();
    expect(service.dishes().length).toBe(2);
    expect(service.isLoading()).toBe(false);
  });

  it('should populate categories dynamically from backend', () => {
    expect(service.categories()).toContain('Todos');
    expect(service.categories()).toContain('Brasas & Pollos');
    expect(service.categories()).toContain('Wok & Salteados');
  });

  it('should return total count and count by category', () => {
    expect(service.getCategoryCount('Todos')).toBe(2);
    expect(service.getCategoryCount('Brasas & Pollos')).toBe(1);
    expect(service.getCategoryCount('Wok & Salteados')).toBe(1);
  });

  it('should find dish by id correctly', () => {
    const dish = service.getDishById(1);
    expect(dish).toBeDefined();
    expect(dish?.name).toBe('1 Pollo a la Brasa Tradicional');
  });
});
