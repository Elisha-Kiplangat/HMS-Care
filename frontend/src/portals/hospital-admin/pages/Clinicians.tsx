import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { apiClient } from '../../../services/apiClient';
import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HospitalClinicians: React.FC = () => {
  const [clinicians, setClinicians] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => { apiClient.get<any[]>('/clinicians').then((response) => setClinicians(response.data)); }, []);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Hospital Clinicians</h1>
        </div>
        <Button size="md" className="w-full sm:w-auto py-3 text-base font-bold" onClick={() => navigate('/hospital-admin/invitations')}>
          <Plus className="w-5 h-5 mr-2" /> Add Clinician
        </Button>
      </div>
      
      <Card className="p-0 overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-surface-hover"><tr><th className="p-4">Clinician</th><th className="p-4">Specialty</th><th className="p-4">Licence</th><th className="p-4">Patients</th></tr></thead><tbody className="divide-y divide-border">{clinicians.map((item) => <tr key={item.id}><td className="p-4 font-semibold">{item.user.firstName} {item.user.lastName}<span className="block text-xs text-text-muted">{item.user.email}</span></td><td className="p-4">{item.specialty}</td><td className="p-4">{item.licenceNumber}</td><td className="p-4">{item._count?.assignedPatients || 0}</td></tr>)}</tbody></table></Card>
    </div>
  );
};
