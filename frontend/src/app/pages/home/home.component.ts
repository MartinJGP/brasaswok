import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface FeaturedDish {
  name: string;
  category: 'Brasas' | 'Wok' | 'Entradas' | 'Bebidas';
  description: string;
  price: number;
  isStar?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  selectedCategory = 'Todos';

  readonly categories = ['Todos', 'Brasas', 'Wok', 'Entradas', 'Bebidas'];

  readonly dishes: FeaturedDish[] = [
    {
      name: '1 Pollo a la Brasa Tradicional',
      category: 'Brasas',
      description: 'Pollo entero a la brasa dorado con carbón seleccionado + papas fritas familiares + ensalada clásica + cremas de la casa.',
      price: 74.90,
      isStar: true
    },
    {
      name: 'Lomo Saltado al Wok Criollo',
      category: 'Wok',
      description: 'Trozos de lomo fino salteados a fuego extremo con cebolla, tomate, ají amarillo, acompañado de papas fritas y arroz con choclo.',
      price: 39.90,
      isStar: true
    },
    {
      name: 'Arroz Chaufa de Chancho Asado',
      category: 'Wok',
      description: 'Arroz frito al wok con chancho asado oriental, tortilla de huevo y cebollita china con toque de aceite de ajonjolí.',
      price: 32.90,
      isStar: false
    },
    {
      name: '1/2 Pollo a la Brasa',
      category: 'Brasas',
      description: 'Medio pollo a la brasa jugoso + papas fritas medianas + ensalada personal + surtido de cremas artesanales.',
      price: 42.90,
      isStar: false
    },
    {
      name: 'Aeropuerto Fusión Brasas & Wok',
      category: 'Wok',
      description: 'Combinación estelar de arroz chaufa y fideo wantán salteados al wok con trozos de pollo a la brasa y frejolito chino.',
      price: 35.90,
      isStar: true
    },
    {
      name: 'Tequeños Wok de Pollo (8 und)',
      category: 'Entradas',
      description: 'Ocho tequeños crocantes rellenos con tierno pollo a la brasa y queso derretido, servidos con crema de palta fresca.',
      price: 21.00,
      isStar: false
    },
    {
      name: 'Wantán Frito Especial (12 und)',
      category: 'Entradas',
      description: 'Docena de wantanes dorados crujientes rellenos de pollo y langostinos, acompañados de salsa de tamarindo artesanal.',
      price: 18.00,
      isStar: false
    },
    {
      name: 'Chicha Morada Artesanal 1L',
      category: 'Bebidas',
      description: 'Elaborada diariamente con maíz morado, piña, manzana membrillo, canela y clavo de olor. 100% natural y helada.',
      price: 12.00,
      isStar: false
    }
  ];

  get filteredDishes(): FeaturedDish[] {
    if (this.selectedCategory === 'Todos') {
      return this.dishes;
    }
    return this.dishes.filter(d => d.category === this.selectedCategory);
  }
}
