import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { userService } from '../../../services/userService';
import { patientService } from '../../../services/patientService';
import { apiClient } from '../../../services/apiClient';

export const HospitalAdminDashboard: React.FC = () => {
  const [counts, setCounts] = useState({ clinicians: 0, patients: 0, pending: 0 });
  useEffect(() => { Promise.all([userService.getUsers(), patientService.getPatients(), apiClient.get<any[]>('/invitations').then((response) => response.data)]).then(([users, patients, invitations]) => setCounts({ clinicians: users.filter((user) => ['DIABETOLOGIST', 'DIABETES_NURSE_EDUCATOR', 'CLINICAL_NUTRITIONIST'].includes(user.role)).length, patients: patients.length, pending: invitations.filter((invitation) => invitation.status === 'INVITED').length })); }, []);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text">Hospital Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <span className="text-xs text-text-muted font-bold uppercase">Active Clinicians</span>
          <p className="text-3xl font-black mt-2">{counts.clinicians}</p>
        </Card>
        <Card>
          <span className="text-xs text-text-muted font-bold uppercase">Enrolled Patients</span>
          <p className="text-3xl font-black mt-2">{counts.patients}</p>
        </Card>
        <Card>
          <span className="text-xs text-text-muted font-bold uppercase">Pending Refills</span>
          <p className="text-3xl font-black mt-2">{counts.pending}</p>
        </Card>
      </div>
    </div>
  );
};
