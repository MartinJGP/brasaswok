import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface SedeInfo {
  name: string;
  badge: string;
  address: string;
  reference: string;
  phone: string;
  whatsapp: string;
  dineInHours: string;
  deliveryZones: string[];
  features: string[];
}

@Component({
  selector: 'app-sedes',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './sedes.component.html'
})
export class SedesComponent {
  readonly sede: SedeInfo = {
    name: 'Sede Principal San Borja',
    badge: 'Salón & Delivery Central',
    address: 'Av. Javier Prado Este 1234, San Borja, Lima',
    reference: 'A 2 cuadras de la estación La Cultura del Metro de Lima',
    phone: '(01) 719-2020',
    whatsapp: '987 654 321',
    dineInHours: 'Lun a Sáb: 12:00 PM - 11:30 PM | Dom y Fer: 12:00 PM - 10:00 PM',
    deliveryZones: ['San Borja', 'Surco', 'San Isidro', 'Miraflores', 'San Luis', 'La Victoria'],
    features: [
      'Salón con aire climatizado y terraza',
      'Cocina abierta con wok y brasero a la vista',
      'Estacionamiento vehicular con vigilancia',
      'Acceso habilitado para personas con movilidad reducida',
      'Empaque térmico hermético para delivery express'
    ]
  };
}
