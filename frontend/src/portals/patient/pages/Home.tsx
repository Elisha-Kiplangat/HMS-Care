import React, { useEffect, useState } from 'react';
import { Activity, CalendarDays, ClipboardList, Droplets, Plus, Syringe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { patientService } from '../../../services/patientService';
import { PatientProfile } from '../../../types';

export const PatientHome: React.FC = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    patientService.getMe().then(setPatient).catch(() => setError('Unable to load your medical summary.'));
  }, []);

  const latestReading = patient?.glucoseReadings?.[0];
  const latestHba1c = patient?.hba1cResults?.[0];
  const nextAppointment = patient?.appointments?.[0];
  const formatAppointment = nextAppointment ? new Date(nextAppointment.startTime).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : null;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Good morning, {patient?.user.firstName || 'there'}</h1>
          <p className="text-xs text-text-muted mt-1">Here is your daily glycemic summary</p>
        </div>
        <Button size="lg" className="w-full sm:w-auto py-3 text-base font-bold" onClick={() => navigate('/patient/log-glucose')}>
          <Plus className="w-5 h-5 mr-2" /> Log Glucose
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={<Droplets className="h-5 w-5" />} label="Latest glucose" value={latestReading ? `${latestReading.value} mmol/L` : '—'} detail={latestReading ? `${latestReading.context} · ${new Date(latestReading.measuredAt).toLocaleDateString()}` : 'No readings yet'} />
        <SummaryCard icon={<Activity className="h-5 w-5" />} label="Latest HbA1c" value={latestHba1c ? `${latestHba1c.value}%` : '—'} detail={latestHba1c ? `Result from ${new Date(latestHba1c.resultDate).toLocaleDateString()}` : 'Most recent saved result'} />
        <SummaryCard icon={<Syringe className="h-5 w-5" />} label="Medications" value={String(patient?.medications?.length || 0)} detail="Active prescriptions" onClick={() => navigate('/patient/medications')} />
        <SummaryCard icon={<CalendarDays className="h-5 w-5" />} label="Appointments" value={String(patient?.appointments?.length || 0)} detail={formatAppointment || 'No upcoming appointments'} onClick={() => navigate('/patient/appointments')} />
      </div>

      <Card className="flex items-center justify-between gap-4">
        <div><p className="text-sm font-bold text-text">Keep your care record current</p><p className="text-xs text-text-muted mt-1">Review your readings, prescriptions, and visits.</p></div>
        <ClipboardList className="h-6 w-6 text-primary shrink-0" />
      </Card>
    </div>
  );
};

const SummaryCard: React.FC<{ icon: React.ReactNode; label: string; value: string; detail: string; onClick?: () => void }> = ({ icon, label, value, detail, onClick }) => (
  <Card className={`flex flex-col gap-2 ${onClick ? 'cursor-pointer hover:border-primary/50' : ''}`} onClick={onClick}>
    <div className="flex items-center gap-2 text-primary"><span>{icon}</span><span className="text-xs font-semibold text-text-muted">{label}</span></div>
    <span className="text-2xl font-bold text-text">{value}</span>
    <span className="text-xs text-text-muted">{detail}</span>
  </Card>
);
