import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { SearchField } from '../../../components/ui/SearchField';
import { patientService } from '../../../services/patientService';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const ClinicianPatientList: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  useEffect(() => { patientService.getPatients().then(setPatients); }, []);
  const visible = patients.filter((patient) => `${patient.user.firstName} ${patient.user.lastName} ${patient.patientCode || ''}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Assigned Patients</h1>
          <p className="text-xs text-text-muted mt-1">Type 2 diabetes cohort at Embu Level 5</p>
        </div>
        <div className="w-64">
          <SearchField placeholder="Search patient name or MRN..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-hover border-b border-border text-xs font-semibold text-text-muted uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Patient ID</th>
              <th className="px-6 py-3">Latest Glucose</th>
              <th className="px-6 py-3">HbA1c</th>
              <th className="px-6 py-3">Risk</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visible.map((patient) => <tr key={patient.id} className="hover:bg-surface-hover/50"><td className="px-6 py-4 font-bold"><Link className="text-primary" to={`/clinician/patients/${patient.id}`}>{patient.user.firstName} {patient.user.lastName}</Link></td><td className="px-6 py-4 text-xs text-text-muted">{patient.patientCode || `PT-${patient.id.slice(0, 8).toUpperCase()}`}</td><td className="px-6 py-4 font-semibold text-emerald-600">{patient.glucoseReadings?.[0]?.value ?? '--'}{patient.glucoseReadings?.[0] ? ' mmol/L' : ''}</td><td className="px-6 py-4 font-semibold">{patient.hba1cResults?.[0]?.value ? `${patient.hba1cResults[0].value}%` : '--'}</td><td className="px-6 py-4">{patient.riskAssessments?.[0]?.tier || 'Not assessed'}</td><td className="px-6 py-4"><Link to={`/clinician/patients/${patient.id}`} aria-label={`View ${patient.user.firstName} ${patient.user.lastName}`}><Button size="sm" variant="outline"><Eye className="mr-1 h-4 w-4" />View</Button></Link></td></tr>)}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
