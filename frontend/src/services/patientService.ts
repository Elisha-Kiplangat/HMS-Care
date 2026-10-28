import { apiClient } from './apiClient';
import { PatientProfile } from '../types';

export const patientService = {
  async getMe(): Promise<PatientProfile> {
    const response = await apiClient.get<PatientProfile>('/patients/me');
    return response.data;
  },

  async getPatients(): Promise<PatientProfile[]> {
    const response = await apiClient.get<PatientProfile[]>('/patients');
    return response.data;
  },

  async getPatient(id: string): Promise<PatientProfile> {
    const response = await apiClient.get<PatientProfile>(`/patients/${id}`);
    return response.data;
  },

  async assignClinician(patientId: string, clinicianId: string): Promise<PatientProfile> {
    const response = await apiClient.put<PatientProfile>(`/patients/${patientId}/assign-clinician`, { clinicianId });
    return response.data;
  },
};
