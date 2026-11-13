import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AdminService, AdminCategory } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './categories.component.html'
})
export class AdminCategoriesComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly categories = signal<AdminCategory[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly showModal = signal<boolean>(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly editingCategoryId = signal<number | null>(null);
  readonly searchTerm = signal<string>('');

  categoryForm: Partial<AdminCategory> = {
    name: '',
    description: '',
    isActive: true
  };

  readonly filteredCategories = computed<AdminCategory[]>(() => {
    const search = this.searchTerm().trim().toLowerCase();
    if (!search) return this.categories();
    return this.categories().filter(c =>
      c.name.toLowerCase().includes(search) ||
      (c.description && c.description.toLowerCase().includes(search))
    );
  });

  readonly totalActive = computed<number>(() => {
    return this.categories().filter(c => c.isActive).length;
  });

  readonly totalInactive = computed<number>(() => {
    return this.categories().filter(c => !c.isActive).length;
  });

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
    this.modalMode.set('create');
    this.editingCategoryId.set(null);
    this.categoryForm = {
      name: '',
      description: '',
      isActive: true
    };
    this.showModal.set(true);
  }

  openEditModal(category: AdminCategory): void {
    this.modalMode.set('edit');
    this.editingCategoryId.set(category.id);
    this.categoryForm = {
      name: category.name,
      description: category.description,
      isActive: category.isActive
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
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

  handleSaveCategory(): void {
    if (this.modalMode() === 'create') {
      this.adminService.createCategory(this.categoryForm).subscribe({
        next: (created) => {
          this.categories.update(list => [...list, created]);
          this.closeModal();
        },
        error: (err) => {
          alert(err?.error?.message || 'No se pudo registrar la categoría');
        }
      });
    } else {
      const id = this.editingCategoryId();
      if (!id) return;
      this.adminService.updateCategory(id, this.categoryForm).subscribe({
        next: (updated) => {
          this.categories.update(list => list.map(c => c.id === updated.id ? updated : c));
          this.closeModal();
        },
        error: (err) => {
          alert(err?.error?.message || 'No se pudo actualizar la categoría');
        }
      });
    }
  }

  handleDeleteCategory(category: AdminCategory): void {
    if (!confirm(`¿Estás seguro de eliminar la sección "${category.name}"? Los platos asociados podrían verse afectados.`)) {
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
