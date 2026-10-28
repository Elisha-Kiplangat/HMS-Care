import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { refillService } from '../../../services/refillService';

export const PatientRefills: React.FC = () => {
  const [refills, setRefills] = useState<any[]>([]);
  useEffect(() => { refillService.getRefills().then(setRefills); }, []);
  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-text">Prescription Refills</h1>
        <p className="text-xs text-text-muted mt-1">Embu Level 5 Pharmacy Queue</p>
      </div>

      {refills.map((refill) => <Card key={refill.id} className="flex items-center justify-between"><div><h4 className="text-sm font-bold">{refill.medication?.name} {refill.medication?.dose}</h4><p className="text-xs text-text-muted">Requested {new Date(refill.requestedAt).toLocaleDateString()}</p></div><Badge variant="warning">{refill.status}</Badge></Card>)}
    </div>
  );
};
