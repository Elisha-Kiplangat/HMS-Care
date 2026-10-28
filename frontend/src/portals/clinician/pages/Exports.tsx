import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Download } from 'lucide-react';
import { exportService } from '../../../services/exportService';

export const ClinicianExports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const download = async () => { setLoading(true); setError(null); try { const result = await exportService.triggerExcelExport(); const link = document.createElement('a'); link.href = result.downloadUrl; link.download = 'glucose-export-my-patients.xlsx'; link.click(); window.setTimeout(() => URL.revokeObjectURL(result.downloadUrl), 1000); } catch { setError('The report could not be downloaded.'); } finally { setLoading(false); } };
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text">Research Excel Exports</h1>
      <Card className="flex flex-col gap-3">
        <h3 className="text-base font-bold">Pseudonymised Research Dataset</h3>
        <p className="text-xs text-text-muted">
          Export longitudinal glycemic and clinical metrics for audit and research. All patient identifiers are pseudonymised.
        </p>
        <p className="text-sm text-text-muted">This report includes glucose readings for your assigned patients only.</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button className="w-fit mt-2" onClick={() => void download()} disabled={loading}>
          <Download className="w-4 h-4 mr-2" /> {loading ? 'Preparing report...' : 'Download Excel'}
        </Button>
      </Card>
    </div>
  );
};
