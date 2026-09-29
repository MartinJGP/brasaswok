import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface ScheduleSlot {
  dayGroup: string;
  dineInHours: string;
  deliveryHours: string;
  isPeak: boolean;
}

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './horarios.component.html'
})
export class HorariosComponent {
  readonly schedules: ScheduleSlot[] = [
    {
      dayGroup: 'Lunes a Jueves',
      dineInHours: '12:00 PM - 11:00 PM',
      deliveryHours: '12:00 PM - 10:30 PM',
      isPeak: false
    },
    {
      dayGroup: 'Viernes y Sábados',
      dineInHours: '12:00 PM - 11:30 PM',
      deliveryHours: '12:00 PM - 11:00 PM',
      isPeak: true
    },
    {
      dayGroup: 'Domingos y Feriados',
      dineInHours: '12:00 PM - 10:00 PM',
      deliveryHours: '12:00 PM - 9:30 PM',
      isPeak: true
    }
  ];

  readonly currentTime = signal<Date>(new Date());

  readonly isOpenNow = computed(() => {
    const now = this.currentTime();
    const day = now.getDay();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hour * 60 + minutes;

    const startMinutes = 12 * 60;
    const endMinutes = (day === 0) ? (22 * 60) : (23 * 60 + 30);

    return totalMinutes >= startMinutes && totalMinutes < endMinutes;
  });
}
