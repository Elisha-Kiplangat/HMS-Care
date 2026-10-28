import { apiClient } from './apiClient';
import { Tenant, User, AuditLog, TenantSettings } from '../types';

export const tenantService = {
  async getTenants(): Promise<Tenant[]> {
    const response = await apiClient.get<Tenant[]>('/tenants');
    return response.data;
  },

  async getTenant(id: string): Promise<Tenant> {
    const response = await apiClient.get<Tenant>(`/tenants/${id}`);
    return response.data;
  },

  async createTenant(data: Partial<Tenant> & { adminEmail?: string; adminPhone?: string }): Promise<Tenant & { adminInvitationToken?: string }> {
    const response = await apiClient.post<Tenant & { adminInvitationToken?: string }>('/tenants', data);
    return response.data;
  },

  async updateSettings(id: string, data: Partial<TenantSettings>): Promise<TenantSettings> {
    const response = await apiClient.put<TenantSettings>(`/tenants/${id}/settings`, data);
    return response.data;
  },

  async updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant> {
    const response = await apiClient.put<Tenant>(`/tenants/${id}`, data);
    return response.data;
  },

  async getPlatformAdmins(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users?role=HOSPITAL_ADMIN');
    return response.data;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const response = await apiClient.get<AuditLog[]>('/audit-logs');
    return response.data;
  },
};
