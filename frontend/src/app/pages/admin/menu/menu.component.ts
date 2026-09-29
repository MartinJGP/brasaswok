import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AdminService, AdminProduct, AdminCategory } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-brand-text-primary font-sans">
            Gestión de Platos & Menú
          </h1>
          <p class="text-xs sm:text-sm text-brand-text-secondary">
            Administración del catálogo, precios y disponibilidad en la carta.
          </p>
        </div>

        <button
          type="button"
          (click)="showCreateModal = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-card transition-all active:scale-95 self-start sm:self-auto"
        >
          <app-icon name="plus" [size]="16"></app-icon>
          <span>Nuevo Plato</span>
        </button>
      </div>

      <div *ngIf="isLoading" class="p-12 text-center text-xs text-brand-text-secondary">
        Cargando catálogo...
      </div>

      <div *ngIf="!isLoading" class="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-card">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-brand-surface-alt/70 text-brand-text-muted border-b border-brand-border uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th class="px-5 py-3.5">Plato</th>
                <th class="px-5 py-3.5">Categoría</th>
                <th class="px-5 py-3.5">Precio</th>
                <th class="px-5 py-3.5">Disponibilidad</th>
                <th class="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-brand-border/60 text-brand-text-primary">
              <tr *ngFor="let product of products" class="hover:bg-brand-surface-alt/40 transition-colors">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      [src]="product.imageUrl || 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6'"
                      [alt]="product.name"
                      class="w-12 h-12 rounded-xl object-cover border border-brand-border shrink-0"
                    />
                    <div>
                      <span class="font-bold text-sm text-brand-text-primary block leading-tight">
                        {{ product.name }}
                      </span>
                      <p class="text-[11px] text-brand-text-secondary line-clamp-1 max-w-xs mt-0.5">
                        {{ product.description }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4">
                  <span class="px-2.5 py-0.5 rounded-full bg-brand-surface-alt border border-brand-border text-[11px] font-medium text-brand-text-secondary">
                    {{ product.categoryName || 'General' }}
                  </span>
                </td>
                <td class="px-5 py-4 font-mono font-bold text-brand-primary text-sm">
                  S/ {{ product.price.toFixed(2) }}
                </td>
                <td class="px-5 py-4">
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    [ngClass]="product.isAvailable ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'"
                  >
                    {{ product.isAvailable ? 'Disponible' : 'Agotado' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <button
                    type="button"
                    (click)="toggleAvailability(product)"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95"
                    [ngClass]="product.isAvailable ? 'border-brand-border text-brand-text-secondary hover:text-brand-text-primary' : 'border-emerald-500/40 text-emerald-600 bg-emerald-50/50'"
                  >
                    {{ product.isAvailable ? 'Pausar' : 'Activar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-secondary/70 backdrop-blur-sm">
        <div class="bg-brand-surface rounded-2xl border border-brand-border p-6 max-w-lg w-full shadow-dropdown space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-brand-border">
            <h3 class="text-base font-bold text-brand-text-primary">Registrar Nuevo Plato</h3>
            <button (click)="showCreateModal = false" class="text-brand-text-muted hover:text-brand-text-primary">
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>

          <form (ngSubmit)="handleCreateProduct()" class="space-y-3.5 text-xs">
            <div>
              <label class="block font-semibold text-brand-text-primary mb-1">Nombre del Plato</label>
              <input
                type="text"
                [(ngModel)]="newProduct.name"
                name="name"
                required
                placeholder="Ej: Tacu Tacu en Salsa de Mariscos"
                class="w-full px-3 py-2 bg-brand-surface-alt border border-brand-border rounded-xl focus:border-brand-primary"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-brand-text-primary mb-1">Categoría</label>
                <select
                  [(ngModel)]="newProduct.categoryId"
                  name="categoryId"
                  class="w-full px-3 py-2 bg-brand-surface-alt border border-brand-border rounded-xl focus:border-brand-primary"
                >
                  <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-brand-text-primary mb-1">Precio (S/)</label>
                <input
                  type="number"
                  step="0.10"
                  [(ngModel)]="newProduct.price"
                  name="price"
                  required
                  placeholder="35.00"
                  class="w-full px-3 py-2 bg-brand-surface-alt border border-brand-border rounded-xl focus:border-brand-primary font-mono"
                />
              </div>
            </div>

            <div>
              <label class="block font-semibold text-brand-text-primary mb-1">Descripción</label>
              <textarea
                [(ngModel)]="newProduct.description"
                name="description"
                rows="2"
                placeholder="Ingredientes clave, término y acompañamiento..."
                class="w-full px-3 py-2 bg-brand-surface-alt border border-brand-border rounded-xl focus:border-brand-primary resize-none"
              ></textarea>
            </div>

            <div>
              <label class="block font-semibold text-brand-text-primary mb-1">URL de Fotografía</label>
              <input
                type="url"
                [(ngModel)]="newProduct.imageUrl"
                name="imageUrl"
                placeholder="https://images.unsplash.com/..."
                class="w-full px-3 py-2 bg-brand-surface-alt border border-brand-border rounded-xl focus:border-brand-primary"
              />
            </div>

            <div class="pt-2 flex justify-end gap-2">
              <button
                type="button"
                (click)="showCreateModal = false"
                class="px-4 py-2 rounded-xl text-brand-text-secondary hover:bg-brand-surface-alt"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="!newProduct.name || !newProduct.price"
                class="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white font-bold rounded-xl shadow-card"
              >
                Guardar Plato
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminMenuComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  products: AdminProduct[] = [];
  categories: AdminCategory[] = [];
  isLoading = false;
  showCreateModal = false;

  newProduct: Partial<AdminProduct> = {
    name: '',
    description: '',
    price: 0,
    categoryId: 1,
    imageUrl: '',
    isAvailable: true
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.adminService.getProducts().subscribe(products => {
      this.products = products;
      this.isLoading = false;
    });

    this.adminService.getCategories().subscribe(categories => {
      this.categories = categories;
      if (categories.length > 0) {
        this.newProduct.categoryId = categories[0].id;
      }
    });
  }

  toggleAvailability(product: AdminProduct): void {
    this.adminService.toggleProductAvailability(product.id).subscribe(() => {
      product.isAvailable = !product.isAvailable;
    });
  }

  handleCreateProduct(): void {
    this.adminService.createProduct(this.newProduct).subscribe(created => {
      this.products.unshift(created);
      this.showCreateModal = false;
      this.newProduct = {
        name: '',
        description: '',
        price: 0,
        categoryId: this.categories[0]?.id || 1,
        imageUrl: '',
        isAvailable: true
      };
    });
  }
}
