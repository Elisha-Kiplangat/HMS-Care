import { apiClient } from './apiClient';
import { Appointment } from '../types';

export const appointmentService = {
  async getAppointments(forClinician = false): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>(forClinician ? '/appointments' : '/appointments/me');
    return response.data;
  },

  async requestAppointment(data: Partial<Appointment>): Promise<Appointment> {
    const response = await apiClient.post<Appointment>('/appointments/me', data);
    return response.data;
  },

  async updateStatus(id: string, status: string): Promise<Appointment> {
    const response = await apiClient.put<Appointment>(`/appointments/${id}/status`, { status });
    return response.data;
  },

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    const response = await apiClient.post<Appointment>('/appointments', data);
    return response.data;
  },

  async scheduleForPatient(patientId: string, data: Omit<Partial<Appointment>, 'patientId' | 'clinicianId'>): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(`/appointments/patients/${patientId}`, data);
    return response.data;
  },
};
