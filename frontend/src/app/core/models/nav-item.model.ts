import { IconName } from '../../shared/components/icon/icon.component';
import { BadgeVariant } from '../../shared/components/badge/badge.component';

export interface NavItem {
  label: string;
  path: string;
  icon: IconName;
  badge?: string | number;
  badgeVariant?: BadgeVariant;
  section?: string;
}
