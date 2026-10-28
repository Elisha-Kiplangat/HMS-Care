import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { analyticsService } from '../../../services/analyticsService';
import { apiClient } from '../../../services/apiClient';
import { exportService } from '../../../services/exportService';
import { Download } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const HospitalReports: React.FC = () => {
  const [summary, setSummary] = useState<Record<string, unknown>>({});
  const [clinicians, setClinicians] = useState<any[]>([]);
  const [clinicianId, setClinicianId] = useState('');
  const [csvLoading, setCsvLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { analyticsService.getAnalyticsSummary().then(setSummary); apiClient.get<any[]>('/clinicians').then((response) => setClinicians(response.data)).catch(() => setError('Clinicians could not be loaded.')); }, []);
  const download = async (format: 'csv' | 'xlsx') => { if (format === 'csv') setCsvLoading(true); else setExcelLoading(true); setError(null); try { const result = format === 'csv' ? await exportService.triggerCsvExport(clinicianId || undefined) : await exportService.triggerExcelExport(clinicianId || undefined); const link = document.createElement('a'); link.href = result.downloadUrl; link.download = `glucose-export-${clinicianId || 'hospital'}.${format}`; link.click(); window.setTimeout(() => URL.revokeObjectURL(result.downloadUrl), 1000); } catch { setError(`${format === 'csv' ? 'CSV' : 'Excel'} report could not be downloaded.`); } finally { if (format === 'csv') setCsvLoading(false); else setExcelLoading(false); } };
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text">Operational Reports</h1>
      <div className="grid md:grid-cols-4 gap-4">{[['Patients', 'totalPatients'], ['Readings', 'totalReadings'], ['Average glucose', 'averageGlucoseMmol'], ['Time in range', 'timeInRangePercentage']].map(([label, key]) => <Card key={key}><span className="text-xs text-text-muted uppercase">{label}</span><strong className="text-3xl mt-2">{String(summary[key] ?? '--')}{key === 'timeInRangePercentage' ? '%' : ''}</strong></Card>)}</div>
      <Card className="flex flex-col gap-3"><h2 className="text-base font-bold text-text">Download glucose report</h2><p className="text-xs text-text-muted">Reports are limited to this hospital. Select a clinician to download only their assigned patients.</p><select className="w-full max-w-md rounded-lg border border-border bg-background px-3 py-2 text-sm" value={clinicianId} onChange={(event) => setClinicianId(event.target.value)}><option value="">Whole hospital</option>{clinicians.map((clinician) => <option key={clinician.id} value={clinician.id}>{clinician.user.firstName} {clinician.user.lastName} · {clinician.specialty}</option>)}</select>{error && <p className="text-sm text-red-600">{error}</p>}<div className="flex flex-wrap gap-3"><Button onClick={() => void download('csv')} disabled={csvLoading}><Download className="mr-2 h-4 w-4" />{csvLoading ? 'Preparing CSV...' : 'Download CSV'}</Button><Button variant="outline" onClick={() => void download('xlsx')} disabled={excelLoading}><Download className="mr-2 h-4 w-4" />{excelLoading ? 'Preparing Excel...' : 'Download Excel'}</Button></div></Card>
    </div>
  );
};
