import { apiClient } from './apiClient';

export const exportService = {
  async triggerCsvExport(clinicianId?: string): Promise<{ downloadUrl: string }> {
    const response = await apiClient.get<Blob>('/exports/glucose/csv', { params: clinicianId ? { clinicianId } : undefined, responseType: 'blob' });
    return { downloadUrl: URL.createObjectURL(response.data) };
  },

  async triggerExcelExport(clinicianId?: string): Promise<{ downloadUrl: string }> {
    const response = await apiClient.get<Blob>('/exports/glucose/xlsx', { params: clinicianId ? { clinicianId } : undefined, responseType: 'blob' });
    return { downloadUrl: URL.createObjectURL(response.data) };
  },
};
