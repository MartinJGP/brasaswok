import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api';

  private fallbackOrders: AdminOrder[] = [
    {
      id: 101,
      orderNumber: 'BW-9421',
      customerId: 2,
      customerName: 'Cliente de Prueba',
      customerPhone: '991234567',
      status: 'PENDIENTE',
      paymentMethod: 'TARJETA',
      deliveryAddress: 'Av. Javier Prado Este 1234, Dpto 402',
      deliveryPhone: '991234567',
      deliveryNotes: 'Papas bien doradas y ají extra',
      subtotal: 74.90,
      deliveryFee: 5.00,
      totalAmount: 79.90,
      createdAt: new Date().toISOString(),
      items: [
        {
          id: 1,
          productId: 1,
          productName: '1 Pollo a la Brasa Tradicional',
          unitPrice: 74.90,
          quantity: 1,
          subtotal: 74.90,
          notes: 'Papas bien doradas y ají extra'
        }
      ]
    },
    {
      id: 102,
      orderNumber: 'BW-8134',
      customerId: 3,
      customerName: 'María Fernanda Quispe',
      customerPhone: '984556677',
      status: 'EN_COCINA',
      paymentMethod: 'YAPE_PLIN',
      deliveryAddress: 'Calle Las Begonias 320, San Isidro',
      deliveryPhone: '984556677',
      subtotal: 72.80,
      deliveryFee: 5.00,
      totalAmount: 77.80,
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      items: [
        {
          id: 2,
          productId: 4,
          productName: 'Lomo Saltado al Wok Criollo',
          unitPrice: 39.90,
          quantity: 1,
          subtotal: 39.90
        },
        {
          id: 3,
          productId: 6,
          productName: 'Arroz Chaufa Especial de Chancho Asado',
          unitPrice: 32.90,
          quantity: 1,
          subtotal: 32.90
        }
      ]
    },
    {
      id: 103,
      orderNumber: 'BW-7209',
      customerId: 4,
      customerName: 'Renzo Alarcón',
      customerPhone: '971122334',
      status: 'EN_CAMINO',
      paymentMethod: 'EFECTIVO',
      deliveryAddress: 'Av. Dos de Mayo 880, San Isidro',
      deliveryPhone: '971122334',
      subtotal: 36.90,
      deliveryFee: 5.00,
      totalAmount: 41.90,
      createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
      items: [
        {
          id: 4,
          productId: 5,
          productName: 'Tallarín Saltado Criollo de Carne',
          unitPrice: 36.90,
          quantity: 1,
          subtotal: 36.90
        }
      ]
    }
  ];

  private fallbackProducts: AdminProduct[] = [
    {
      id: 1,
      name: '1 Pollo a la Brasa Tradicional',
      description: '1 Pollo entero a la brasa marinado 24h al carbón + papas fritas familiares + ensalada + cremas.',
      price: 74.90,
      categoryId: 1,
      categoryName: 'Brasas & Pollos',
      imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80',
      isAvailable: true
    },
    {
      id: 2,
      name: 'Lomo Saltado al Wok Criollo',
      description: 'Trozos de lomo fino salteados al fuego vivo con cebolla, tomate, ají amarillo y cilantro.',
      price: 39.90,
      categoryId: 2,
      categoryName: 'Wok & Salteados',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      isAvailable: true
    },
    {
      id: 3,
      name: 'Arroz Chaufa Especial de Chancho Asado',
      description: 'Arroz frito al wok con chancho asado oriental caramelizado, tortilla de huevo y cebollita china.',
      price: 32.90,
      categoryId: 3,
      categoryName: 'Chaufas & Aeropuertos',
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
      isAvailable: true
    }
  ];

  private fallbackCategories: AdminCategory[] = [
    { id: 1, name: 'Brasas & Pollos', description: 'Especialidades al carbón y leña', isActive: true },
    { id: 2, name: 'Wok & Salteados', description: 'Salteados criollo-orientales a 300°C', isActive: true },
    { id: 3, name: 'Chaufas & Aeropuertos', description: 'Fusión de arroz y fideos al wok', isActive: true },
    { id: 4, name: 'Entradas & Piques', description: 'Wantanes y tequeños artesanales', isActive: true },
    { id: 5, name: 'Bebidas', description: 'Chicha natural y bebidas heladas', isActive: true }
  ];

  getOrders(status?: string): Observable<AdminOrder[]> {
    const url = status && status !== 'TODOS'
      ? `${this.baseUrl}/admin/orders?status=${status}`
      : `${this.baseUrl}/admin/orders`;

    return this.http.get<AdminOrder[]>(url).pipe(
      catchError(() => {
        if (!status || status === 'TODOS') {
          return of(this.fallbackOrders);
        }
        return of(this.fallbackOrders.filter(o => o.status === status));
      })
    );
  }

  updateOrderStatus(orderId: number, newStatus: string, notes?: string): Observable<AdminOrder> {
    return this.http.put<AdminOrder>(`${this.baseUrl}/admin/orders/${orderId}/status`, {
      status: newStatus,
      comment: notes || ''
    }).pipe(
      catchError(() => {
        const order = this.fallbackOrders.find(o => o.id === orderId);
        if (order) {
          order.status = newStatus as any;
          return of(order);
        }
        return of({ ...this.fallbackOrders[0], status: newStatus as any });
      })
    );
  }

  getOrderLogs(orderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/orders/${orderId}/logs`).pipe(
      catchError(() => of([]))
    );
  }

  getProducts(): Observable<AdminProduct[]> {
    return this.http.get<AdminProduct[]>(`${this.baseUrl}/products?all=true`).pipe(
      catchError(() => of(this.fallbackProducts))
    );
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

    return this.http.post<AdminProduct>(`${this.baseUrl}/products`, payload).pipe(
      catchError(() => {
        const created: AdminProduct = {
          id: Math.floor(100 + Math.random() * 900),
          name: product.name || 'Nuevo Plato',
          description: product.description || '',
          price: product.price || 0,
          categoryId: product.categoryId || 1,
          categoryName: 'Platos & Brasas',
          imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80',
          isAvailable: true
        };
        this.fallbackProducts.unshift(created);
        return of(created);
      })
    );
  }

  toggleProductAvailability(productId: number): Observable<AdminProduct> {
    return this.http.patch<AdminProduct>(`${this.baseUrl}/products/${productId}/toggle-availability`, {}).pipe(
      catchError(() => {
        const product = this.fallbackProducts.find(p => p.id === productId);
        if (product) {
          product.isAvailable = !product.isAvailable;
          return of(product);
        }
        return of(this.fallbackProducts[0]);
      })
    );
  }

  getCategories(): Observable<AdminCategory[]> {
    return this.http.get<AdminCategory[]>(`${this.baseUrl}/categories?all=true`).pipe(
      catchError(() => of(this.fallbackCategories))
    );
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

    return this.http.post<AdminCategory>(`${this.baseUrl}/categories`, payload).pipe(
      catchError(() => {
        const created: AdminCategory = {
          id: Math.floor(10 + Math.random() * 90),
          name: category.name || 'Nueva Categoría',
          description: category.description || '',
          isActive: true
        };
        this.fallbackCategories.push(created);
        return of(created);
      })
    );
  }

  toggleCategoryStatus(categoryId: number): Observable<AdminCategory> {
    return this.http.patch<AdminCategory>(`${this.baseUrl}/categories/${categoryId}/toggle-status`, {}).pipe(
      catchError(() => {
        const cat = this.fallbackCategories.find(c => c.id === categoryId);
        if (cat) {
          cat.isActive = !cat.isActive;
          return of(cat);
        }
        return of(this.fallbackCategories[0]);
      })
    );
  }
}
