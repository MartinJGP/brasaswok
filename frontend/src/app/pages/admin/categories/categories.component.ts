import { Component, OnInit, inject, signal } from '@angular/core';
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
          (click)="openCreateModal()"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl shadow-card transition-all active:scale-95 self-start sm:self-auto"
        >
          <app-icon name="plus" [size]="16"></app-icon>
          <span>Nueva Categoría</span>
        </button>
      </div>

      <div *ngIf="isLoading()" class="p-12 text-center text-xs text-brand-text-secondary bg-brand-surface rounded-2xl border border-brand-border">
        <div class="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"></div>
        <span>Cargando categorías desde el servidor...</span>
      </div>

      <div *ngIf="errorMessage()" class="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center space-y-3">
        <p class="text-xs font-bold text-rose-500">{{ errorMessage() }}</p>
        <button
          type="button"
          (click)="loadCategories()"
          class="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-card transition-all"
        >
          Reintentar Carga
        </button>
      </div>

      <div *ngIf="!isLoading() && !errorMessage() && categories().length === 0" class="p-12 text-center bg-brand-surface rounded-2xl border border-brand-border space-y-3">
        <p class="text-sm font-bold text-brand-text-primary">No hay categorías registradas</p>
        <p class="text-xs text-brand-text-secondary">Comienza creando tu primera categoría culinaria.</p>
      </div>

      <div *ngIf="!isLoading() && !errorMessage() && categories().length > 0" class="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-card">
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
              <tr *ngFor="let cat of categories()" class="hover:bg-brand-surface-alt/40 transition-colors">
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
                  <div class="inline-flex items-center gap-2">
                    <button
                      type="button"
                      (click)="toggleStatus(cat)"
                      class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95"
                      [ngClass]="cat.isActive ? 'border-brand-border text-brand-text-secondary hover:text-brand-text-primary' : 'border-emerald-500/40 text-emerald-600 bg-emerald-50/50'"
                    >
                      {{ cat.isActive ? 'Desactivar' : 'Activar' }}
                    </button>
                    <button
                      type="button"
                      (click)="handleDeleteCategory(cat)"
                      class="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all active:scale-95"
                      title="Eliminar categoría"
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
        <div class="bg-brand-surface rounded-2xl border border-brand-border p-6 max-w-md w-full shadow-dropdown space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-brand-border">
            <h3 class="text-base font-bold text-brand-text-primary">Crear Categoría</h3>
            <button (click)="closeCreateModal()" class="text-brand-text-muted hover:text-brand-text-primary">
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
                class="w-full px-3 py-2 bg-brand-surface-alt border border-brand-border rounded-xl focus:border-brand-primary text-brand-text-primary"
              />
            </div>

            <div>
              <label class="block font-semibold text-brand-text-primary mb-1">Descripción</label>
              <textarea
                [(ngModel)]="newCategory.description"
                name="description"
                rows="2"
                placeholder="Breve reseña de la categoría..."
                class="w-full px-3 py-2 bg-brand-surface-alt border border-brand-border rounded-xl focus:border-brand-primary resize-none text-brand-text-primary"
              ></textarea>
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

  readonly categories = signal<AdminCategory[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly showCreateModal = signal<boolean>(false);

  newCategory: Partial<AdminCategory> = {
    name: '',
    description: '',
    isActive: true
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.adminService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar las categorías desde el servidor.');
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

  toggleStatus(category: AdminCategory): void {
    this.adminService.toggleCategoryStatus(category.id).subscribe({
      next: () => {
        this.categories.update(list =>
          list.map(c => c.id === category.id ? { ...c, isActive: !c.isActive } : c)
        );
      },
      error: (err) => {
        alert(err?.error?.message || 'No se pudo cambiar el estado de la categoría');
      }
    });
  }

  handleCreateCategory(): void {
    this.adminService.createCategory(this.newCategory).subscribe({
      next: (created) => {
        this.categories.update(list => [...list, created]);
        this.showCreateModal.set(false);
        this.newCategory = {
          name: '',
          description: '',
          isActive: true
        };
      },
      error: (err) => {
        alert(err?.error?.message || 'No se pudo crear la categoría');
      }
    });
  }

  handleDeleteCategory(category: AdminCategory): void {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
      return;
    }
    this.adminService.deleteCategory(category.id).subscribe({
      next: () => {
        this.categories.update(list => list.filter(c => c.id !== category.id));
      },
      error: (err) => {
        alert(err?.error?.message || 'No se pudo eliminar la categoría');
      }
    });
  }
}
