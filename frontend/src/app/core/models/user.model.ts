export type UserRole = 'ROLE_ADMIN' | 'ROLE_CUSTOMER';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: string;
  role?: UserRole;
}
