import { apiClient } from './apiClient';
import { RiskAssessment, RiskTier } from '../types';

export const triageService = {
  async getTriageCohort(): Promise<RiskAssessment[]> {
    const response = await apiClient.get<RiskAssessment[]>('/triage/cohort');
    return response.data;
  },

  async updateRisk(patientId: string, tier: RiskTier, reasons: string[]): Promise<RiskAssessment> {
    const response = await apiClient.put<RiskAssessment>(`/triage/patients/${patientId}/risk`, { tier, reasons });
    return response.data;
  },
};
