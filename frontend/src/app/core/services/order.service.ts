import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerOrderItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  notes?: string;
}

export interface CustomerOrderStatusLog {
  id: number;
  previousStatus?: string;
  newStatus: string;
  comment?: string;
  createdAt: string;
}

export interface CustomerOrder {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  status: 'PENDIENTE' | 'EN_COCINA' | 'EN_CAMINO' | 'ENTREGADO' | 'CANCELADO';
  paymentMethod: string;
  deliveryAddress: string;
  deliveryPhone: string;
  deliveryNotes?: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  createdAt: string;
  items: CustomerOrderItem[];
  statusLogs?: CustomerOrderStatusLog[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/orders';

  // obtiene historial de comandas del cliente autenticado
  getMyOrders(): Observable<CustomerOrder[]> {
    return this.http.get<CustomerOrder[]>(`${this.baseUrl}/my-orders`);
  }

  // rastrea pedido publicamente por codigo de ticket
  trackOrder(orderNumber: string): Observable<CustomerOrder> {
    const cleanNumber = orderNumber.trim().toUpperCase();
    return this.http.get<CustomerOrder>(`${this.baseUrl}/track/${cleanNumber}`);
  }

  // cancela pedido en estado pendiente
  cancelOrder(orderId: number, reason?: string): Observable<CustomerOrder> {
    return this.http.put<CustomerOrder>(`${this.baseUrl}/${orderId}/cancel`, {
      reason: reason || 'Cancelado por el cliente'
    });
  }
}
