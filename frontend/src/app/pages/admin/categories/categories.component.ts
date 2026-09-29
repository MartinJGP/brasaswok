import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AdminService, AdminCategory } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-brand-text-primary font-sans">
            Categorías del Menú
          </h1>
          <p class="text-xs sm:text-sm text-brand-text-secondary">
            Organización de secciones culinarias para salón y delivery.
          </p>
        </div>

        <button
          type="button"
          (click)="showCreateModal = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-card transition-all active:scale-95 self-start sm:self-auto"
        >
          <app-icon name="plus" [size]="16"></app-icon>
          <span>Nueva Categoría</span>
        </button>
      </div>

      <div *ngIf="isLoading" class="p-12 text-center text-xs text-brand-text-secondary">
        Cargando categorías...
      </div>

      <div *ngIf="!isLoading" class="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-card">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-brand-surface-alt/70 text-brand-text-muted border-b border-brand-border uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th class="px-5 py-3.5">ID</th>
                <th class="px-5 py-3.5">Nombre de la Categoría</th>
                <th class="px-5 py-3.5">Descripción</th>
                <th class="px-5 py-3.5">Estado</th>
                <th class="px-5 py-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-brand-border/60 text-brand-text-primary">
              <tr *ngFor="let cat of categories" class="hover:bg-brand-surface-alt/40 transition-colors">
                <td class="px-5 py-4 font-mono font-bold text-brand-text-muted">
                  #{{ cat.id }}
                </td>
                <td class="px-5 py-4 font-bold text-sm text-brand-text-primary">
                  {{ cat.name }}
                </td>
                <td class="px-5 py-4 text-brand-text-secondary">
                  {{ cat.description }}
                </td>
                <td class="px-5 py-4">
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    [ngClass]="cat.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'"
                  >
                    {{ cat.isActive ? 'Activa' : 'Inactiva' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <button
                    type="button"
                    (click)="toggleStatus(cat)"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95"
                    [ngClass]="cat.isActive ? 'border-brand-border text-brand-text-secondary hover:text-brand-text-primary' : 'border-emerald-500/40 text-emerald-600 bg-emerald-50/50'"
                  >
                    {{ cat.isActive ? 'Desactivar' : 'Activar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-secondary/70 backdrop-blur-sm">
        <div class="bg-brand-surface rounded-2xl border border-brand-border p-6 max-w-md w-full shadow-dropdown space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-brand-border">
            <h3 class="text-base font-bold text-brand-text-primary">Crear Categoría</h3>
            <button (click)="showCreateModal = false" class="text-brand-text-muted hover:text-brand-text-primary">
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>

          <form (ngSubmit)="handleCreateCategory()" class="space-y-3.5 text-xs">
            <div>
              <label class="block font-semibold text-brand-text-primary mb-1">Nombre</label>
              <input
                type="text"
                [(ngModel)]="newCategory.name"
                name="name"
                required
                placeholder="Ej: Postres Caseros"
                class="w-full px-3 py-2 bg-brand-surface-alt border border-brand-border rounded-xl focus:border-brand-primary"
              />
            </div>

            <div>
              <label class="block font-semibold text-brand-text-primary mb-1">Descripción</label>
              <textarea
                [(ngModel)]="newCategory.description"
                name="description"
                rows="2"
                placeholder="Breve reseña de la categoría..."
                class="w-full px-3 py-2 bg-brand-surface-alt border border-brand-border rounded-xl focus:border-brand-primary resize-none"
              ></textarea>
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
                [disabled]="!newCategory.name"
                class="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white font-bold rounded-xl shadow-card"
              >
                Guardar Categoría
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminCategoriesComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  categories: AdminCategory[] = [];
  isLoading = false;
  showCreateModal = false;

  newCategory: Partial<AdminCategory> = {
    name: '',
    description: '',
    isActive: true
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.adminService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.isLoading = false;
    });
  }

  toggleStatus(category: AdminCategory): void {
    this.adminService.toggleCategoryStatus(category.id).subscribe(() => {
      category.isActive = !category.isActive;
    });
  }

  handleCreateCategory(): void {
    this.adminService.createCategory(this.newCategory).subscribe(created => {
      this.categories.push(created);
      this.showCreateModal = false;
      this.newCategory = {
        name: '',
        description: '',
        isActive: true
      };
    });
  }
}
