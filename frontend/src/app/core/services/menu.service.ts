import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Dish } from '../models/dish.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private readonly _dishes = signal<Dish[]>([]);
  private readonly _categories = signal<string[]>(['Todos']);
  private readonly _isLoading = signal<boolean>(true);
  private readonly _error = signal<string | null>(null);

  readonly dishes = this._dishes.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    this.loadDishes();
  }

  // carga platos y categorias desde el backend
  loadDishes(): void {
    this._isLoading.set(true);
    this._error.set(null);

    forkJoin({
      products: this.http.get<any[]>(`${this.baseUrl}/products`),
      categories: this.http.get<any[]>(`${this.baseUrl}/categories`)
    }).subscribe({
      next: ({ products, categories }) => {
        const mappedDishes: Dish[] = (products || []).map(p => ({
          id: p.id,
          name: p.name,
          category: p.categoryName || 'General',
          description: p.description || '',
          price: Number(p.price),
          imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80',
          isStar: p.name.includes('Pollo') || p.name.includes('Lomo') || p.name.includes('Chaufa'),
          prepTime: '15-20 min',
          servings: '1-2 personas'
        }));

        this._dishes.set(mappedDishes);

        const categoryNames = ['Todos'];
        if (categories && categories.length > 0) {
          categories.forEach(c => {
            if (c.name && !categoryNames.includes(c.name)) {
              categoryNames.push(c.name);
            }
          });
        }
        this._categories.set(categoryNames);
        this._isLoading.set(false);
      },
      error: () => {
        this._isLoading.set(false);
        this._error.set('No se pudo cargar la carta gastronómica desde el servidor.');
      }
    });
  }

  // busca plato por id
  getDishById(id: number): Dish | undefined {
    return this._dishes().find(d => d.id === id);
  }

  // calcula cantidad de platos por categoria
  getCategoryCount(category: string): number {
    if (category === 'Todos') {
      return this._dishes().length;
    }
    return this._dishes().filter(d => d.category === category).length;
  }
}
