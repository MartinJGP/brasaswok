import { Injectable, signal, computed } from '@angular/core';
import { Dish, DishCategory } from '../models/dish.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly _dishes = signal<Dish[]>([
    {
      id: 1,
      name: '1 Pollo a la Brasa Tradicional',
      category: 'Brasas & Pollos',
      description: '1 Pollo entero a la brasa marinado 24h al carbón y leña + papas fritas familiares crocantes + ensalada clásica fresca + cremas artesanales de la casa.',
      price: 74.90,
      imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80',
      badgeText: 'Fórmula Secreta',
      prepTime: '20-25 min',
      servings: '3-4 personas',
      isStar: true
    },
    {
      id: 2,
      name: '1/2 Pollo a la Brasa',
      category: 'Brasas & Pollos',
      description: 'Medio pollo a la brasa jugoso con piel dorada crocante + papas fritas medianas + ensalada personal fresca + surtido de cremas de la casa.',
      price: 42.90,
      imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
      prepTime: '15-20 min',
      servings: '2 personas',
      isStar: false
    },
    {
      id: 3,
      name: '1/4 Pollo a la Brasa Clásico',
      category: 'Brasas & Pollos',
      description: 'Un cuarto de pollo a la brasa (pierna o pecho a elección) + papas fritas doradas + ensalada fresca clásica + cremas de ají y vinagreta.',
      price: 24.90,
      imageUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80',
      prepTime: '10-15 min',
      servings: '1 persona',
      isStar: false
    },
    {
      id: 4,
      name: 'Lomo Saltado al Wok Criollo',
      category: 'Wok & Salteados',
      description: 'Trozos de lomo fino salteados al fuego vivo con cebolla roja, tomate en gajos, ají amarillo y cilantro fresco, servido con papas fritas y arroz con choclo.',
      price: 39.90,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      badgeText: 'Wok Hei Vivo',
      prepTime: '15 min',
      servings: '1 persona',
      isStar: true
    },
    {
      id: 5,
      name: 'Tallarín Saltado Criollo de Carne',
      category: 'Wok & Salteados',
      description: 'Tallarines gruesos salteados a fuego intenso con lomo de res, cebolla morada crujiente, tomate en gajos y cebollita china con toque de salsa de soya.',
      price: 36.90,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
      prepTime: '15 min',
      servings: '1 persona',
      isStar: false
    },
    {
      id: 6,
      name: 'Arroz Chaufa Especial de Chancho Asado',
      category: 'Chaufas & Aeropuertos',
      description: 'Arroz frito al wok con chancho asado oriental caramelizado, tortilla de huevo, pimiento y cebollita china aromatizado con aceite de ajonjolí tostado.',
      price: 32.90,
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
      badgeText: 'Receta Cantonesa',
      prepTime: '15 min',
      servings: '1 persona',
      isStar: true
    },
    {
      id: 7,
      name: 'Aeropuerto Fusión Brasas & Wok',
      category: 'Chaufas & Aeropuertos',
      description: 'Combinación estelar de arroz chaufa y fideo wantán salteados al wok con trozos de pollo a la brasa deshilachado y frejolito chino crujiente.',
      price: 35.90,
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
      badgeText: 'Fusión Insignia',
      prepTime: '15-20 min',
      servings: '1-2 personas',
      isStar: true
    },
    {
      id: 8,
      name: 'Wantán Frito Especial (12 und)',
      category: 'Entradas & Piques',
      description: 'Docena de wantanes crocantes dorados en su punto, rellenos de pulpa de pollo y langostinos, servidos con salsa de tamarindo artesanal agridulce.',
      price: 18.00,
      imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
      prepTime: '10 min',
      servings: 'Para picar',
      isStar: false
    },
    {
      id: 9,
      name: 'Tequeños Wok de Pollo a la Brasa (8 und)',
      category: 'Entradas & Piques',
      description: 'Ocho tequeños crujientes rellenos con tierno pollo a la brasa deshilachado y queso mantecoso fundido, servidos con crema de palta y salsa tártara.',
      price: 21.00,
      imageUrl: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&w=800&q=80',
      prepTime: '10 min',
      servings: 'Para picar',
      isStar: false
    },
    {
      id: 10,
      name: 'Chicha Morada Artesanal 1L',
      category: 'Bebidas',
      description: 'Elaborada diariamente con maíz morado culli, cáscara de piña madura, membrillo, manzana, canela de Chanchamayo y clavo de olor. 100% natural y helada.',
      price: 12.00,
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      badgeText: '100% Natural',
      prepTime: 'Inmediato',
      servings: '1 Litro',
      isStar: false
    },
    {
      id: 11,
      name: 'Inka Kola 1.5L',
      category: 'Bebidas',
      description: 'Botella de 1.5L helada, la bebida de sabor nacional perfecta para acompañar tu pollo a la brasa o salteado al wok.',
      price: 10.00,
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
      prepTime: 'Inmediato',
      servings: '1.5 Litros',
      isStar: false
    }
  ]);

  readonly categories: DishCategory[] = [
    'Todos',
    'Brasas & Pollos',
    'Wok & Salteados',
    'Chaufas & Aeropuertos',
    'Entradas & Piques',
    'Bebidas'
  ];

  readonly dishes = this._dishes.asReadonly();

  getDishById(id: number): Dish | undefined {
    return this._dishes().find(d => d.id === id);
  }

  getCategoryCount(category: DishCategory): number {
    if (category === 'Todos') {
      return this._dishes().length;
    }
    return this._dishes().filter(d => d.category === category).length;
  }
}
