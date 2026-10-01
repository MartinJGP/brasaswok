import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html'
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';

  readonly variantClasses: Record<BadgeVariant, string> = {
    success: 'bg-brand-status-success-bg text-brand-status-success border border-brand-status-success/20',
    warning: 'bg-brand-status-warning-bg text-brand-status-warning border border-brand-status-warning/20',
    error: 'bg-brand-status-error-bg text-brand-status-error border border-brand-status-error/20',
    info: 'bg-brand-status-info-bg text-brand-status-info border border-brand-status-info/20',
    neutral: 'bg-brand-surface-alt text-brand-text-secondary border border-brand-border'
  };

  readonly dotClasses: Record<BadgeVariant, string> = {
    success: 'bg-brand-status-success',
    warning: 'bg-brand-status-warning',
    error: 'bg-brand-status-error',
    info: 'bg-brand-status-info',
    neutral: 'bg-brand-text-secondary'
  };
}
