import { apiClient } from './apiClient';
import { Medication } from '../types';

export interface CreateMedicationInput {
  patientId: string;
  name: string;
  dose: string;
  instructions?: string;
  quantityDispensed?: number;
  startDate: string;
  endDate?: string;
  schedules?: Array<{ timeOfDay: string; daysOfWeek?: number[] }>;
}

export const medicationService = {
  async getMedications(patientId?: string): Promise<Medication[]> {
    const url = patientId ? `/medications/patients/${patientId}` : '/medications/me';
    const response = await apiClient.get<Medication[]>(url);
    return response.data;
  },

  async addMedication(data: CreateMedicationInput): Promise<Medication> {
    const { patientId, ...medication } = data;
    const response = await apiClient.post<Medication>(`/medications/patients/${patientId}`, medication);
    return response.data;
  },
};
