import { Component, OnInit, inject, signal } from '@angular/core';
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
