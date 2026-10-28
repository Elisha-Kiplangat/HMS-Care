import { apiClient } from './apiClient';
import { GlucoseReading, GlucoseContext } from '../types';

export const glucoseService = {
  async getReadings(patientId?: string): Promise<GlucoseReading[]> {
    const url = patientId ? `/glucose/patients/${patientId}` : '/glucose/me';
    const response = await apiClient.get<GlucoseReading[]>(url);
    return response.data;
  },

  async logReading(data: {
    patientId?: string;
    value: number;
    context: GlucoseContext;
    measuredAt?: string;
    notes?: string;
  }): Promise<GlucoseReading> {
    const response = await apiClient.post<GlucoseReading>('/glucose/me', data);
    return response.data;
  },
};
