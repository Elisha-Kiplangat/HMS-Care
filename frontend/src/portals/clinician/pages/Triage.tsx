import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { RiskBadge } from '../../../components/domain/RiskBadge';
import { RiskTier } from '../../../types';
import { triageService } from '../../../services/triageService';

export const ClinicianTriage: React.FC = () => {
  const [cohort, setCohort] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { triageService.getTriageCohort().then(setCohort).catch(() => setError('Unable to load triage data.')).finally(() => setLoading(false)); }, []);
  const count = (tier: RiskTier) => cohort.filter((item) => item.latestRisk?.tier === tier).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Clinical Triage Cohort</h1>
          <p className="text-xs text-text-muted mt-1">Risk-stratified cohort for Embu Level 5 Hospital</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50/50">
          <span className="text-xs font-bold text-red-700 uppercase">Critical</span>
          <span className="text-3xl font-black text-red-800 mt-1">{count(RiskTier.CRITICAL)}</span>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <span className="text-xs font-bold text-amber-700 uppercase">High</span>
          <span className="text-3xl font-black text-amber-800 mt-1">{count(RiskTier.HIGH)}</span>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <span className="text-xs font-bold text-blue-700 uppercase">Moderate</span>
          <span className="text-3xl font-black text-blue-800 mt-1">{count(RiskTier.MODERATE)}</span>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50/50">
          <span className="text-xs font-bold text-emerald-700 uppercase">Low</span>
          <span className="text-3xl font-black text-emerald-800 mt-1">{count(RiskTier.LOW)}</span>
        </Card>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && <p className="text-sm text-text-muted">Loading triage data...</p>}

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-surface-hover border-b border-border text-xs font-semibold text-text-muted uppercase">
            <tr>
              <th className="px-6 py-3">Patient</th>
              <th className="px-6 py-3">Patient ID</th>
              <th className="px-6 py-3">Risk Tier</th>
              <th className="px-6 py-3">HbA1c</th>
              <th className="px-6 py-3">Latest Glucose</th>
              <th className="px-6 py-3">In Range (30)</th>
              <th className="px-6 py-3">Last Log</th>
              <th className="px-6 py-3">Trigger Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cohort.map((item) => (
              <tr key={item.patientId} className="hover:bg-surface-hover/50 transition-colors">
                <td className="px-6 py-4 font-bold text-text">{item.patientName}</td>
                <td className="px-6 py-4 text-xs text-text-muted">{item.patientCode}</td>
                <td className="px-6 py-4">{item.latestRisk ? <RiskBadge tier={item.latestRisk.tier} /> : 'Not assessed'}</td>
                <td className="px-6 py-4 font-semibold">{item.latestHba1c ? `${item.latestHba1c.value}%` : '--'}</td>
                <td className="px-6 py-4 font-semibold">{item.latestGlucose ? `${item.latestGlucose.value} mmol/L` : '--'}</td>
                <td className="px-6 py-4">{item.inRangeCount ?? 0}</td>
                <td className="px-6 py-4 text-xs text-text-muted">{item.lastReadingAt ? new Date(item.lastReadingAt).toLocaleDateString() : '--'}</td>
                <td className="px-6 py-4 text-xs font-medium text-text-muted">{item.latestRisk?.reasons?.join(', ') || 'No assessment'}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>
    </div>
  );
};
