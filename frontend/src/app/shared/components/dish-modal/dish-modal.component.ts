import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

import { Dish } from '../../../core/models/dish.model';

export type DishData = Dish;

@Component({
  selector: 'app-dish-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './dish-modal.component.html'
})
export class DishModalComponent {
  @Input() dish: DishData | null = null;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() addDish = new EventEmitter<{ dish: DishData; quantity: number; notes: string }>();

  quantity = 1;
  notes = '';

  increment(): void {
    this.quantity++;
  }

  decrement(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  handleAdd(): void {
    if (this.dish) {
      this.addDish.emit({
        dish: this.dish,
        quantity: this.quantity,
        notes: this.notes.trim()
      });
      this.close();
    }
  }

  close(): void {
    this.quantity = 1;
    this.notes = '';
    this.closeEvent.emit();
  }
}
