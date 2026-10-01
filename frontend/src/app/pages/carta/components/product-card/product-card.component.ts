import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dish } from '../../../../core/models/dish.model';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input({ required: true }) dish!: Dish;
  @Input() inCartQuantity: number = 0;
  @Output() selectDish = new EventEmitter<Dish>();
  @Output() quickAdd = new EventEmitter<Dish>();
  @Output() updateQuantity = new EventEmitter<{ dish: Dish; delta: number }>();
}
