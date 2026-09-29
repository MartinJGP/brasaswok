import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Brasas a Wok | Pollos a la Brasa & Cocina al Wok'
      },
      {
        path: 'carta',
        loadComponent: () => import('./pages/carta/carta.component').then(m => m.CartaComponent),
        title: 'La Carta Gastronómica | Brasas a Wok'
      },
      {
        path: 'mis-pedidos',
        loadComponent: () => import('./pages/my-orders/my-orders.component').then(m => m.MyOrdersComponent),
        title: 'Mis Pedidos & Seguimiento | Brasas a Wok'
      },
      {
        path: 'pedidos',
        redirectTo: 'mis-pedidos'
      }
    ]
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./pages/error/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
    title: '403 Acceso Restringido | Brasas a Wok'
  },
  {
    path: '403',
    redirectTo: 'forbidden'
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Panel Administrativo | Brasas a Wok'
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/admin/orders/orders.component').then(m => m.AdminOrdersComponent),
        title: 'Cocina & Pedidos | Brasas a Wok'
      },
      {
        path: 'menu',
        loadComponent: () => import('./pages/admin/menu/menu.component').then(m => m.AdminMenuComponent),
        title: 'Gestión de Carta | Brasas a Wok'
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/admin/categories/categories.component').then(m => m.AdminCategoriesComponent),
        title: 'Categorías | Brasas a Wok'
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/error/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 No Encontrado | Brasas a Wok'
  }
];
