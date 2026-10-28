import { apiClient } from './apiClient';

export const telemedicineService = {
  async getTurnCredentials(): Promise<Record<string, unknown>> {
    const response = await apiClient.get<Record<string, unknown>>('/telemedicine/turn-credentials');
    return response.data;
  },

  async startSession(sessionId: string): Promise<void> {
    await apiClient.post(`/telemedicine/sessions/${sessionId}/start`);
  },

  async endSession(sessionId: string): Promise<void> {
    await apiClient.post(`/telemedicine/sessions/${sessionId}/end`, {});
  },
};
