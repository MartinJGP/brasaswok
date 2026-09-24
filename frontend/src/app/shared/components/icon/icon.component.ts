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
  | 'shopping-bag';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [class]="customClass"
      aria-hidden="true"
    >
      <ng-container [ngSwitch]="name">
        <g *ngSwitchCase="'dashboard'">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </g>

        <g *ngSwitchCase="'orders'">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </g>

        <g *ngSwitchCase="'shopping-bag'">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </g>

        <g *ngSwitchCase="'menu'">
          <path d="M18 2v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V2" />
          <path d="M14 2v20" />
          <path d="M4 2v6a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3V2" />
          <path d="M7 11v11" />
        </g>

        <g *ngSwitchCase="'categories'">
          <path d="M20 7h-7" />
          <path d="M14 17H5" />
          <circle cx="17" cy="17" r="3" />
          <circle cx="7" cy="7" r="3" />
        </g>

        <g *ngSwitchCase="'tables'">
          <path d="M4 4h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          <path d="M6 10v10" />
          <path d="M18 10v10" />
        </g>

        <g *ngSwitchCase="'users'">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </g>

        <g *ngSwitchCase="'reports'">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </g>

        <g *ngSwitchCase="'settings'">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </g>

        <g *ngSwitchCase="'bell'">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </g>

        <g *ngSwitchCase="'search'">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </g>

        <g *ngSwitchCase="'menu-toggle'">
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </g>

        <g *ngSwitchCase="'x'">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </g>

        <g *ngSwitchCase="'chevron-down'">
          <path d="m6 9 6 6 6-6" />
        </g>

        <g *ngSwitchCase="'arrow-up-right'">
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </g>

        <g *ngSwitchCase="'trending-up'">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </g>

        <g *ngSwitchCase="'clock'">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </g>

        <g *ngSwitchCase="'dollar'">
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </g>

        <g *ngSwitchCase="'flame'">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" />
        </g>

        <g *ngSwitchCase="'check'">
          <polyline points="20 6 9 17 4 12" />
        </g>

        <g *ngSwitchCase="'alert'">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" x2="12" y1="9" y2="13" />
          <line x1="12" x2="12.01" y1="17" y2="17" />
        </g>

        <g *ngSwitchCase="'phone'">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </g>

        <g *ngSwitchCase="'map-pin'">
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <circle cx="12" cy="10" r="3" />
        </g>

        <g *ngSwitchCase="'arrow-right'">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </g>

        <g *ngSwitchCase="'truck'">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
          <circle cx="17" cy="18.5" r="2.5" />
          <circle cx="7" cy="18.5" r="2.5" />
        </g>
      </ng-container>
    </svg>
  `
})
export class IconComponent {
  @Input() name: IconName = 'dashboard';
  @Input() size: number = 20;
  @Input() customClass: string = '';
}
