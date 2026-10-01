import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconName =
  | 'dashboard'
  | 'orders'
  | 'menu'
  | 'categories'
  | 'tables'
  | 'users'
  | 'reports'
  | 'settings'
  | 'bell'
  | 'search'
  | 'menu-toggle'
  | 'x'
  | 'chevron-down'
  | 'arrow-up-right'
  | 'trending-up'
  | 'clock'
  | 'dollar'
  | 'flame'
  | 'check'
  | 'alert'
  | 'phone'
  | 'map-pin'
  | 'arrow-right'
  | 'truck'
  | 'shopping-bag'
  | 'trash'
  | 'plus'
  | 'minus'
  | 'edit'
  | 'user'
  | 'log-out'
  | 'lock'
  | 'mail';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html'
})
export class IconComponent {
  @Input() name: IconName = 'dashboard';
  @Input() size: number = 20;
  @Input() customClass: string = '';
}
