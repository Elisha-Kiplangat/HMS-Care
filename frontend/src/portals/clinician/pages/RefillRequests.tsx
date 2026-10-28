import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { refillService } from '../../../services/refillService';

export const ClinicianRefillRequests: React.FC = () => {
  const [refills, setRefills] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setRefills(await refillService.getAllRefills());
    } catch {
      setError('Refill requests could not be loaded.');
    }
  };

  useEffect(() => { void load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await refillService.updateRefillStatus(id, status as any);
      await load();
    } catch {
      setError('Refill status could not be updated.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Refill requests</h1>
        <p className="text-xs text-text-muted mt-1">Review and process medication refill requests.</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Card>
        <div className="flex flex-col gap-3">
          {refills.length === 0 && <p className="text-sm text-text-muted">No refill requests.</p>}
          {refills.map((refill) => (
            <div key={refill.id} className="flex flex-col gap-3 border-b border-border pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold">{refill.patient?.user?.firstName} {refill.patient?.user?.lastName}</p>
                <p className="text-xs text-text-muted">{refill.medication?.name} {refill.medication?.dose} · {refill.status} · Due {refill.estimatedDueDate ? new Date(refill.estimatedDueDate).toLocaleDateString() : 'unknown'}</p>
                {refill.notes && <p className="text-xs text-text-muted">Note: {refill.notes}</p>}
              </div>
              <div className="flex items-center gap-2"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${refill.priority === 'URGENT' ? 'bg-red-100 text-red-700' : refill.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{refill.priority || 'ROUTINE'}</span>
              <div className="flex gap-2">
                {refill.status === 'PENDING' && <Button size="sm" onClick={() => void updateStatus(refill.id, 'APPROVED')}>Approve refill</Button>}
                {refill.status === 'APPROVED' && <Button size="sm" variant="outline" onClick={() => void updateStatus(refill.id, 'FULFILLED')}>Mark fulfilled</Button>}
              </div></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ClinicianRefillRequests;
