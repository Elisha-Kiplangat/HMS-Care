import { apiClient } from './apiClient';

export const analyticsService = {
  async getAnalyticsSummary(): Promise<Record<string, unknown>> {
    const response = await apiClient.get<Record<string, unknown>>('/analytics/summary');
    return response.data;
  },
};
