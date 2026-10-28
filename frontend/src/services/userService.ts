import { apiClient } from './apiClient';
import { User } from '../types';

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  async inviteUser(data: { email: string; role: string; tenantId?: string; phone?: string; firstName: string; lastName: string }): Promise<{ token?: string; invitationUrl?: string }> {
    const response = await apiClient.post<{ token?: string; invitationUrl?: string }>('/invitations', data);
    return response.data;
  },

  async activateUser(id: string): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}/activate`);
    return response.data;
  },

  async updateUser(id: string, data: { firstName: string; lastName: string; phone?: string }): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async deactivateUser(id: string): Promise<User> {
    const response = await apiClient.delete<User>(`/users/${id}`);
    return response.data;
  },

  async createPasswordReset(id: string): Promise<{ resetToken: string; expiresIn: string }> {
    const response = await apiClient.post<{ resetToken: string; expiresIn: string }>(`/users/${id}/password-reset`);
    return response.data;
  },
};
