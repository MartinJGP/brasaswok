import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { DishModalComponent, DishData } from '../../shared/components/dish-modal/dish-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IconComponent, DishModalComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  selectedCategory = 'Todos';
  activeDishForModal: DishData | null = null;

  readonly categories = ['Todos', 'Brasas & Pollos', 'Wok & Salteados', 'Chaufas & Aeropuertos', 'Entradas & Piques', 'Bebidas'];

  readonly dishes: DishData[] = [
    {
      id: 1,
      name: '1 Pollo a la Brasa Tradicional',
      category: 'Brasas & Pollos',
      description: '1 Pollo entero a la brasa + papas fritas familiares + ensalada clásica + cremas de la casa (ají pollero artesanal, vinagreta y tártara).',
      price: 74.90,
      isStar: true
    },
    {
      id: 2,
      name: '1/2 Pollo a la Brasa',
      category: 'Brasas & Pollos',
      description: 'Medio pollo a la brasa jugoso + papas fritas medianas + ensalada personal + surtido de cremas de la casa.',
      price: 42.90,
      isStar: false
    },
    {
      id: 3,
      name: '1/4 Pollo a la Brasa Clásico',
      category: 'Brasas & Pollos',
      description: 'Un cuarto de pollo a la brasa (pierna o pecho a elección) + papas fritas + ensalada fresca + cremas.',
      price: 24.90,
      isStar: false
    },
    {
      id: 4,
      name: 'Lomo Saltado al Wok Criollo',
      category: 'Wok & Salteados',
      description: 'Trozos de lomo fino salteados al fuego vivo con cebolla, tomate, ají amarillo y cilantro, acompañado de papas fritas y arroz con choclo.',
      price: 39.90,
      isStar: true
    },
    {
      id: 5,
      name: 'Tallarín Saltado Criollo de Carne',
      category: 'Wok & Salteados',
      description: 'Tallarines salteados al fuego vivo con trozos de lomo de res, cebolla morada, tomate en gajos y cebollita china con toque de soya.',
      price: 36.90,
      isStar: false
    },
    {
      id: 6,
      name: 'Arroz Chaufa Especial de Chancho Asado',
      category: 'Chaufas & Aeropuertos',
      description: 'Arroz frito al wok con chancho asado oriental, tortilla de huevo y cebollita china aromatizado con aceite de ajonjolí.',
      price: 32.90,
      isStar: true
    },
    {
      id: 7,
      name: 'Aeropuerto Fusión Brasas & Wok',
      category: 'Chaufas & Aeropuertos',
      description: 'Combinación estelar de arroz chaufa y fideo wantán salteados al wok con trozos de pollo a la brasa y frejolito chino.',
      price: 35.90,
      isStar: true
    },
    {
      id: 8,
      name: 'Wantán Frito Especial (12 und)',
      category: 'Entradas & Piques',
      description: 'Docena de wantanes crocantes rellenos de pollo y langostinos servidos con abundante salsa de tamarindo artesanal.',
      price: 18.00,
      isStar: false
    },
    {
      id: 9,
      name: 'Tequeños Wok de Pollo a la Brasa (8 und)',
      category: 'Entradas & Piques',
      description: 'Ocho tequeños crujientes rellenos con tierno pollo a la brasa y queso, servidos con crema de palta y tártara.',
      price: 21.00,
      isStar: false
    },
    {
      id: 10,
      name: 'Chicha Morada Artesanal 1L',
      category: 'Bebidas',
      description: 'Elaborada diariamente con maíz morado, piña, manzana membrillo, canela y clavo de olor. 100% natural y helada.',
      price: 12.00,
      isStar: false
    },
    {
      id: 11,
      name: 'Inka Kola 1.5L',
      category: 'Bebidas',
      description: 'Gaseosa Inka Kola botella descartable de 1.5 litros para compartir en familia.',
      price: 10.00,
      isStar: false
    }
  ];

  constructor(
    public readonly cartService: CartService,
    public readonly authService: AuthService
  ) {}

  get filteredDishes(): DishData[] {
    if (this.selectedCategory === 'Todos') {
      return this.dishes;
    }
    return this.dishes.filter(d => d.category === this.selectedCategory);
  }

  getQuantityInCart(productId: number): number {
    const item = this.cartService.items().find(i => i.productId === productId);
    return item ? item.quantity : 0;
  }

  quickAdd(dish: DishData, event: Event): void {
    event.stopPropagation();
    this.cartService.addItem(dish, 1, '');
  }

  openDishModal(dish: DishData): void {
    this.activeDishForModal = dish;
  }

  closeDishModal(): void {
    this.activeDishForModal = null;
  }

  onAddFromModal(event: { dish: DishData; quantity: number; notes: string }): void {
    this.cartService.addItem(event.dish, event.quantity, event.notes);
  }
}
