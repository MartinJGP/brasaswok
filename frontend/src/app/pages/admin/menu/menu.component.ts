import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
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
          (click)="openCreateModal()"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-card transition-all active:scale-95 self-start sm:self-auto"
        >
          <app-icon name="plus" [size]="16"></app-icon>
          <span>Nuevo Plato</span>
        </button>
      </div>

      <div *ngIf="isLoading()" class="p-12 text-center text-xs text-brand-text-secondary bg-brand-surface rounded-2xl border border-brand-border">
        <div class="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"></div>
        <span>Cargando catálogo desde el servidor...</span>
      </div>

      <div *ngIf="errorMessage()" class="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center space-y-3">
        <p class="text-xs font-bold text-rose-500">{{ errorMessage() }}</p>
        <button
          type="button"
          (click)="loadData()"
          class="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-card transition-all"
        >
          Reintentar Carga
        </button>
      </div>

      <div *ngIf="!isLoading() && !errorMessage() && products().length === 0" class="p-12 text-center bg-brand-surface rounded-2xl border border-brand-border space-y-3">
        <p class="text-sm font-bold text-brand-text-primary">No hay platos registrados en el menú</p>
        <p class="text-xs text-brand-text-secondary">Comienza registrando tu primer plato con el botón "Nuevo Plato".</p>
      </div>

      <div *ngIf="!isLoading() && !errorMessage() && products().length > 0" class="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-card">
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
              <tr *ngFor="let product of products()" class="hover:bg-brand-surface-alt/40 transition-colors">
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
                  <div class="inline-flex items-center gap-2">
                    <button
                      type="button"
                      (click)="toggleAvailability(product)"
                      class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95"
                      [ngClass]="product.isAvailable ? 'border-brand-border text-brand-text-secondary hover:text-brand-text-primary' : 'border-emerald-500/40 text-emerald-600 bg-emerald-50/50'"
                    >
                      {{ product.isAvailable ? 'Pausar' : 'Activar' }}
                    </button>
                    <button
                      type="button"
                      (click)="handleDeleteProduct(product)"
                      class="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all active:scale-95"
                      title="Eliminar plato"
                    >
                      <app-icon name="trash" [size]="14"></app-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="showCreateModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-secondary/70 backdrop-blur-sm">
        <div class="bg-brand-surface rounded-2xl border border-brand-border p-6 max-w-lg w-full shadow-dropdown space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-brand-border">
            <h3 class="text-base font-bold text-brand-text-primary">Registrar Nuevo Plato</h3>
            <button (click)="closeCreateModal()" class="text-brand-text-muted hover:text-brand-text-primary">
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
                class="w-full px-3 py-2 bg-brand-surface-alt border border-brand-border rounded-xl focus:border-brand-primary text-brand-text-primary"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-brand-text-primary mb-1">Categoría</label>
                <select
                  [(ngModel)]="newProduct.categoryId"
                  name="categoryId"
                  class="w-full px-3 py-2 bg-brand-surface-alt border border-brand-border rounded-xl focus:border-brand-primary text-brand-text-primary"
                >
                  <option *ngFor="let cat of categories()" [value]="cat.id">{{ cat.name }}</option>
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
                  class="w-full px-3 py-2 bg-brand-surface-alt border border-brand-border rounded-xl focus:border-brand-primary font-mono text-brand-text-primary"
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
                class="w-full px-3 py-2 bg-brand-surface-alt border border-brand-border rounded-xl focus:border-brand-primary resize-none text-brand-text-primary"
              ></textarea>
            </div>

            <div>
              <label class="block font-semibold text-brand-text-primary mb-1">Fotografía del Plato</label>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <input
                    type="file"
                    (change)="onFileSelected($event)"
                    accept="image/png,image/jpeg,image/webp"
                    class="text-xs text-brand-text-muted file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:text-[11px] file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary-hover file:cursor-pointer"
                  />
                  <span *ngIf="isUploadingImage()" class="text-[11px] text-brand-primary animate-pulse font-semibold">Subiendo...</span>
                </div>
                <input
                  type="url"
                  [(ngModel)]="newProduct.imageUrl"
                  name="imageUrl"
                  placeholder="O ingresa URL externa (https://...)"
                  class="w-full px-3 py-2 bg-brand-surface-alt border border-brand-border rounded-xl focus:border-brand-primary text-xs text-brand-text-primary"
                />
                <div *ngIf="newProduct.imageUrl" class="flex items-center gap-2 pt-1">
                  <img [src]="newProduct.imageUrl" alt="Preview" class="w-12 h-12 object-cover rounded-xl border border-brand-border" />
                  <span class="text-[11px] text-emerald-500 font-semibold">Imagen lista para guardar</span>
                </div>
              </div>
            </div>

            <div class="pt-2 flex justify-end gap-2">
              <button
                type="button"
                (click)="closeCreateModal()"
                class="px-4 py-2 rounded-xl text-brand-text-secondary hover:bg-brand-surface-alt"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="!newProduct.name || !newProduct.price || isUploadingImage()"
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

  readonly products = signal<AdminProduct[]>([]);
  readonly categories = signal<AdminCategory[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly showCreateModal = signal<boolean>(false);
  readonly isUploadingImage = signal<boolean>(false);

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
    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      products: this.adminService.getProducts(),
      categories: this.adminService.getCategories()
    }).subscribe({
      next: ({ products, categories }) => {
        this.products.set(products);
        this.categories.set(categories);
        if (categories.length > 0) {
          this.newProduct.categoryId = categories[0].id;
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el catálogo de platos. Por favor verifica la conexión con el servidor.');
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  toggleAvailability(product: AdminProduct): void {
    this.adminService.toggleProductAvailability(product.id).subscribe({
      next: () => {
        this.products.update(list =>
          list.map(p => p.id === product.id ? { ...p, isAvailable: !p.isAvailable } : p)
        );
      },
      error: (err) => {
        alert(err?.error?.message || 'No se pudo cambiar la disponibilidad del plato');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isUploadingImage.set(true);
      this.adminService.uploadImage(file).subscribe({
        next: (res) => {
          this.newProduct.imageUrl = 'http://localhost:8080' + res.url;
          this.isUploadingImage.set(false);
        },
        error: (err) => {
          this.isUploadingImage.set(false);
          alert(err?.error?.message || 'Error al subir la imagen');
        }
      });
    }
  }

  handleDeleteProduct(product: AdminProduct): void {
    if (!confirm(`¿Estás seguro de eliminar el plato "${product.name}"?`)) {
      return;
    }
    this.adminService.deleteProduct(product.id).subscribe({
      next: () => {
        this.products.update(list => list.filter(p => p.id !== product.id));
      },
      error: (err) => {
        alert(err?.error?.message || 'No se pudo eliminar el plato');
      }
    });
  }

  handleCreateProduct(): void {
    this.adminService.createProduct(this.newProduct).subscribe({
      next: (created) => {
        this.products.update(list => [created, ...list]);
        this.showCreateModal.set(false);
        this.newProduct = {
          name: '',
          description: '',
          price: 0,
          categoryId: this.categories()[0]?.id || 1,
          imageUrl: '',
          isAvailable: true
        };
      },
      error: (err) => {
        alert(err?.error?.message || 'No se pudo registrar el plato');
      }
    });
  }
}
