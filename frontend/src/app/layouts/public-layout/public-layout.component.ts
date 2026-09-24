import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, IconComponent],
  templateUrl: './public-layout.component.html'
})
export class PublicLayoutComponent {
  isMobileMenuOpen = false;
}
