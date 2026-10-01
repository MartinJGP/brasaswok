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
  templateUrl: './menu.component.html'
})
export class AdminMenuComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly products = signal<AdminProduct[]>([]);
  readonly categories = signal<AdminCategory[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly showModal = signal<boolean>(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly editingProductId = signal<number | null>(null);
  readonly isUploadingImage = signal<boolean>(false);

  productForm: Partial<AdminProduct> = {
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

  // carga catalogo y categorias
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
          this.productForm.categoryId = categories[0].id;
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el catálogo de platos. Por favor verifica la conexión con el servidor.');
        this.isLoading.set(false);
      }
    });
  }

  // abre modal para registrar plato nuevo
  openCreateModal(): void {
    this.modalMode.set('create');
    this.editingProductId.set(null);
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      categoryId: this.categories()[0]?.id || 1,
      imageUrl: '',
      isAvailable: true
    };
    this.showModal.set(true);
  }

  // abre modal para editar plato y foto
  openEditModal(product: AdminProduct): void {
    this.modalMode.set('edit');
    this.editingProductId.set(product.id);
    this.productForm = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
      isAvailable: product.isAvailable
    };
    this.showModal.set(true);
  }

  // cierra modal de edicion o creacion
  closeModal(): void {
    this.showModal.set(false);
  }

  // alterna disponibilidad de plato
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

  // sube archivo de fotografia
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isUploadingImage.set(true);
      this.adminService.uploadImage(file).subscribe({
        next: (res) => {
          this.productForm.imageUrl = 'http://localhost:8080' + res.url;
          this.isUploadingImage.set(false);
        },
        error: (err) => {
          this.isUploadingImage.set(false);
          alert(err?.error?.message || 'Error al subir la imagen');
        }
      });
    }
  }

  // elimina plato seleccionado
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

  // registra o actualiza plato en base de datos
  handleSaveProduct(): void {
    if (this.modalMode() === 'create') {
      this.adminService.createProduct(this.productForm).subscribe({
        next: (created) => {
          this.products.update(list => [created, ...list]);
          this.closeModal();
        },
        error: (err) => {
          alert(err?.error?.message || 'No se pudo registrar el plato');
        }
      });
    } else {
      const id = this.editingProductId();
      if (!id) return;
      this.adminService.updateProduct(id, this.productForm).subscribe({
        next: (updated) => {
          this.products.update(list => list.map(p => p.id === updated.id ? updated : p));
          this.closeModal();
        },
        error: (err) => {
          alert(err?.error?.message || 'No se pudo actualizar el plato');
        }
      });
    }
  }
}
