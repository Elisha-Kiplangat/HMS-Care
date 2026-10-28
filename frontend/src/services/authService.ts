import { apiClient, setAccessToken, setRefreshToken } from './apiClient';
import { AuthResponse, User } from '../types';

export const authService = {
  async getRegistrationHospitals(): Promise<Array<{ name: string; slug: string }>> {
    const response = await apiClient.get<Array<{ name: string; slug: string }>>('/auth/hospitals');
    return response.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    const token = response.data.tokens?.accessToken || response.data.accessToken;
    const refreshToken = response.data.tokens?.refreshToken || response.data.refreshToken;
    if (token) {
      setAccessToken(token);
    }
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(data: { token: string; newPassword: string }): Promise<void> {
    await apiClient.post('/auth/reset-password', data);
  },

  async acceptInvitation(data: { token: string; password: string; firstName: string; lastName: string; dateOfBirth: string; sex: string; licenceNumber: string }): Promise<void> {
    await apiClient.post('/auth/accept-invitation', data);
  },

  async registerPatient(data: { email: string; password: string; firstName: string; lastName: string; tenantSlug: string; dateOfBirth: string; sex: string }): Promise<void> {
    await apiClient.post('/auth/register/patient', data);
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },
};
