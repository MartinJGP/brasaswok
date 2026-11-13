import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { AdminService, AdminUser } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './users.component.html'
})
export class AdminUsersComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly users = signal<AdminUser[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  readonly searchTerm = signal<string>('');
  readonly selectedRole = signal<string>('ALL');
  readonly selectedStatus = signal<string>('ALL');

  readonly filteredUsers = computed<AdminUser[]>(() => {
    let list = this.users();
    const search = this.searchTerm().trim().toLowerCase();
    const role = this.selectedRole();
    const status = this.selectedStatus();

    if (role !== 'ALL') {
      list = list.filter(u => u.role === role);
    }

    if (status === 'ACTIVE') {
      list = list.filter(u => u.isActive);
    } else if (status === 'INACTIVE') {
      list = list.filter(u => !u.isActive);
    }

    if (search) {
      list = list.filter(u =>
        u.fullName.toLowerCase().includes(search) ||
        u.username.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        (u.phone && u.phone.includes(search))
      );
    }

    return list;
  });

  readonly totalCustomers = computed<number>(() => {
    return this.users().filter(u => u.role === 'ROLE_CUSTOMER' || u.role === 'CLIENT' || u.role === 'CUSTOMER').length;
  });

  readonly totalAdmins = computed<number>(() => {
    return this.users().filter(u => u.role === 'ROLE_ADMIN' || u.role === 'ADMIN').length;
  });

  readonly totalActive = computed<number>(() => {
    return this.users().filter(u => u.isActive).length;
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar la lista de usuarios. Por favor verifica tus permisos o la conexión con el servidor.');
        this.isLoading.set(false);
      }
    });
  }

  toggleStatus(user: AdminUser): void {
    const action = user.isActive ? 'desactivar' : 'activar';
    if (!confirm(`¿Estás seguro de ${action} la cuenta de "${user.fullName}" (${user.username})?`)) {
      return;
    }

    this.adminService.toggleUserStatus(user.id).subscribe({
      next: (updated) => {
        this.users.update(list => list.map(u => u.id === updated.id ? updated : u));
      },
      error: (err) => {
        alert(err?.error?.message || `No se pudo cambiar el estado de la cuenta`);
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  isRoleAdmin(role: string): boolean {
    return role === 'ROLE_ADMIN' || role === 'ADMIN';
  }
}