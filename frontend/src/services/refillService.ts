import { apiClient } from './apiClient';
import { RefillRequest, RefillStatus } from '../types';

export const refillService = {
  async getRefills(): Promise<RefillRequest[]> {
    const response = await apiClient.get<RefillRequest[]>('/refills/me');
    return response.data;
  },

  async getAllRefills(): Promise<RefillRequest[]> {
    const response = await apiClient.get<RefillRequest[]>('/refills');
    return response.data;
  },

  async requestRefill(medicationId: string, notes?: string): Promise<RefillRequest> {
    const response = await apiClient.post<RefillRequest>('/refills', { medicationId, notes });
    return response.data;
  },

  async updateRefillStatus(id: string, status: RefillStatus): Promise<RefillRequest> {
    const response = await apiClient.put<RefillRequest>(`/refills/${id}/status`, { status });
    return response.data;
  },
};
