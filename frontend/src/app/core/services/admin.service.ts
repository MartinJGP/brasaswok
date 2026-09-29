import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminOrder {
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
  items?: Array<{
    id: number;
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    notes?: string;
  }>;
}

export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface AdminCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface DashboardStatsResponse {
  todaySales: number;
  activeOrders: number;
  averageTicket: number;
  totalOrdersToday: number;
  ordersByStatus: Record<string, number>;
  topDishes: Array<{
    name: string;
    quantity: number;
    totalRevenue?: number;
    revenue?: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api';

  getOrders(status?: string): Observable<AdminOrder[]> {
    const url = status && status !== 'TODOS'
      ? `${this.baseUrl}/admin/orders?status=${status}`
      : `${this.baseUrl}/admin/orders`;

    return this.http.get<AdminOrder[]>(url);
  }

  updateOrderStatus(orderId: number, newStatus: string, notes?: string): Observable<AdminOrder> {
    return this.http.put<AdminOrder>(`${this.baseUrl}/admin/orders/${orderId}/status`, {
      status: newStatus,
      comment: notes || ''
    });
  }

  getOrderLogs(orderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/orders/${orderId}/logs`);
  }

  getProducts(): Observable<AdminProduct[]> {
    return this.http.get<AdminProduct[]>(`${this.baseUrl}/products?all=true`);
  }

  createProduct(product: Partial<AdminProduct>): Observable<AdminProduct> {
    const slug = (product as any).slug || product.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `producto-${Date.now()}`;
    const payload = {
      name: product.name,
      slug: slug,
      description: product.description || '',
      price: product.price,
      categoryId: product.categoryId || 1,
      imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80',
      isAvailable: product.isAvailable ?? true
    };

    return this.http.post<AdminProduct>(`${this.baseUrl}/products`, payload);
  }

  updateProduct(id: number, product: Partial<AdminProduct>): Observable<AdminProduct> {
    const slug = (product as any).slug || product.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `producto-${id}`;
    const payload = {
      name: product.name,
      slug: slug,
      description: product.description || '',
      price: product.price,
      categoryId: product.categoryId || 1,
      imageUrl: product.imageUrl || '',
      isAvailable: product.isAvailable ?? true
    };

    return this.http.put<AdminProduct>(`${this.baseUrl}/products/${id}`, payload);
  }

  toggleProductAvailability(productId: number): Observable<AdminProduct> {
    return this.http.patch<AdminProduct>(`${this.baseUrl}/products/${productId}/toggle-availability`, {});
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${productId}`);
  }

  getCategories(): Observable<AdminCategory[]> {
    return this.http.get<AdminCategory[]>(`${this.baseUrl}/categories?all=true`);
  }

  createCategory(category: Partial<AdminCategory>): Observable<AdminCategory> {
    const slug = (category as any).slug || category.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `categoria-${Date.now()}`;
    const payload = {
      name: category.name,
      slug: slug,
      description: category.description || '',
      imageUrl: '',
      displayOrder: 0,
      isActive: true
    };

    return this.http.post<AdminCategory>(`${this.baseUrl}/categories`, payload);
  }

  toggleCategoryStatus(categoryId: number): Observable<AdminCategory> {
    return this.http.patch<AdminCategory>(`${this.baseUrl}/categories/${categoryId}/toggle-status`, {});
  }

  deleteCategory(categoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${categoryId}`);
  }

  getDashboardStats(): Observable<DashboardStatsResponse> {
    return this.http.get<DashboardStatsResponse>(`${this.baseUrl}/admin/dashboard/stats`);
  }

  uploadImage(file: File): Observable<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string; filename: string }>(`${this.baseUrl}/upload/image`, formData);
  }
}
