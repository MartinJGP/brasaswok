import { TestBed } from '@angular/core/testing';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have 11 initial dishes', () => {
    expect(service.dishes().length).toBe(11);
  });

  it('should return all categories including Todos', () => {
    expect(service.categories).toContain('Todos');
    expect(service.categories).toContain('Brasas & Pollos');
    expect(service.categories).toContain('Wok & Salteados');
    expect(service.categories).toContain('Chaufas & Aeropuertos');
    expect(service.categories).toContain('Entradas & Piques');
    expect(service.categories).toContain('Bebidas');
  });

  it('should return total count for Todos and accurate count per category', () => {
    expect(service.getCategoryCount('Todos')).toBe(11);
    expect(service.getCategoryCount('Brasas & Pollos')).toBe(3);
    expect(service.getCategoryCount('Wok & Salteados')).toBe(2);
    expect(service.getCategoryCount('Chaufas & Aeropuertos')).toBe(2);
    expect(service.getCategoryCount('Entradas & Piques')).toBe(2);
    expect(service.getCategoryCount('Bebidas')).toBe(2);
  });

  it('should find dish by id correctly', () => {
    const dish = service.getDishById(1);
    expect(dish).toBeDefined();
    expect(dish?.name).toBe('1 Pollo a la Brasa Tradicional');
  });
});
