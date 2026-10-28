import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { patientService } from '../../../services/patientService';
import { apiClient } from '../../../services/apiClient';
import { userService } from '../../../services/userService';
import { Button } from '../../../components/ui/Button';

export const HospitalPatients: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [clinicians, setClinicians] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [patientResponse, clinicianResponse] = await Promise.all([
        patientService.getPatients(),
        apiClient.get<any[]>('/clinicians'),
      ]);
      setPatients(patientResponse);
      setClinicians(clinicianResponse.data.filter((clinician) => clinician.user.status === 'ACTIVE'));
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Patient data could not be loaded.');
    }
  };

  useEffect(() => { void loadData(); }, []);

  const activatePatient = async (userId: string) => {
    try {
      await userService.activateUser(userId);
      await loadData();
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Patient could not be activated.');
    }
  };

  const assignClinician = async (patientId: string, clinicianId: string) => {
    try {
      const updatedPatient = await patientService.assignClinician(patientId, clinicianId);
      setPatients((currentPatients) => currentPatients.map((patient) => patient.id === patientId
        ? { ...patient, assignedClinician: updatedPatient.assignedClinician }
        : patient));
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Clinician could not be assigned.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text">Hospital Patients</h1>
      {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}
      <Card className="p-0 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-surface-hover"><tr><th className="p-4">Patient</th><th className="p-4">Email</th><th className="p-4">Account</th><th className="p-4">Clinician</th><th className="p-4">Risk</th></tr></thead><tbody className="divide-y divide-border">{patients.map((patient) => <tr key={patient.id}><td className="p-4 font-semibold">{patient.user.firstName} {patient.user.lastName}</td><td className="p-4">{patient.user.email}</td><td className="p-4">{patient.user.status === 'INVITED' ? <Button size="sm" onClick={() => void activatePatient(patient.user.id)}>Activate</Button> : patient.user.status}</td><td className="p-4"><select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={patient.assignedClinician?.id || ''} onChange={(event) => { if (event.target.value) void assignClinician(patient.id, event.target.value); }}><option value="">Unassigned</option>{clinicians.map((clinician) => <option key={clinician.id} value={clinician.id}>{clinician.user.firstName} {clinician.user.lastName} ({clinician.specialty})</option>)}</select></td><td className="p-4">{patient.riskAssessments?.[0]?.tier || 'Not assessed'}</td></tr>)}</tbody></table></div></Card>
    </div>
  );
};
