import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { analyticsService } from '../../../services/analyticsService';

export const ClinicianAnalytics: React.FC = () => {
  const [summary, setSummary] = useState<Record<string, unknown>>({});
  useEffect(() => { analyticsService.getAnalyticsSummary().then(setSummary); }, []);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text">Glycemic Analytics</h1>
      <div className="grid md:grid-cols-4 gap-4">{[['Patients', 'totalPatients'], ['Readings', 'totalReadings'], ['Average mmol/L', 'averageGlucoseMmol'], ['Time in range', 'timeInRangePercentage']].map(([label, key]) => <Card key={key}><span className="text-xs text-text-muted uppercase">{label}</span><strong className="text-3xl mt-2">{String(summary[key] ?? '--')}{key === 'timeInRangePercentage' ? '%' : ''}</strong></Card>)}</div>
    </div>
  );
};
