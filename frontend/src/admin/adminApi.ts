// ВИПРАВЛЕННЯ 1: Використовуємо фігурні дужки, бо у вас api експортується як named export
import { api } from '../services/api';

// ВИПРАВЛЕННЯ 2: Замінив 'str' на 'string'
export interface User {
  id: number;
  name: string;
  email: string;
  is_email_verified: boolean;
  is_admin: boolean;
}

export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get('/admin/users');
  return response.data;
};

// Оновлення користувача
export const updateUser = async (id: number, data: Partial<User>) => {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
};

// Видалення користувача
export const deleteUser = async (id: number) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};