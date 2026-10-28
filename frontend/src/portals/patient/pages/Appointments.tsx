import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../../../services/appointmentService';
import { apiClient } from '../../../services/apiClient';
import { AppointmentMode, UserRole } from '../../../types';

export const PatientAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clinicians, setClinicians] = useState<any[]>([]);
  const [form, setForm] = useState({ role: '', clinicianId: '', startTime: '', endTime: '', mode: AppointmentMode.VIDEO, reason: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const clinicianRoles = [
    { value: UserRole.DIABETOLOGIST, label: 'Diabetologist' },
    { value: UserRole.NURSE_EDUCATOR, label: 'Nurse educator' },
    { value: UserRole.NUTRITIONIST, label: 'Clinical nutritionist' },
  ];
  const filteredClinicians = form.role ? clinicians.filter((clinician) => clinician.specialty === form.role) : [];
  const loadAppointments = () => appointmentService.getAppointments().then(setAppointments).catch(() => setError('Unable to load your appointments.')).finally(() => setLoading(false));
  useEffect(() => { void loadAppointments(); apiClient.get<any[]>('/clinicians').then((response) => setClinicians(response.data)); }, []);

  const requestAppointment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.startTime || !form.endTime) {
      setMessageType('error');
      setMessage('Choose both a start and end time.');
      return;
    }
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      setMessageType('error');
      setMessage('The end time must be after the start time.');
      return;
    }
    try {
      const { role: _role, ...appointment } = form;
      await appointmentService.requestAppointment({ ...appointment, startTime: new Date(form.startTime).toISOString(), endTime: new Date(form.endTime).toISOString() });
      setMessageType('success');
      setMessage('Appointment request sent for clinician approval.');
      setForm({ role: '', clinicianId: '', startTime: '', endTime: '', mode: AppointmentMode.VIDEO, reason: '' });
      await loadAppointments();
    }
    catch (requestError: any) { setMessageType('error'); setMessage(requestError.response?.data?.message || 'Appointment request could not be sent.'); }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-text">Appointments</h1>
        <p className="text-xs text-text-muted mt-1">Virtual and in-person visits</p>
      </div>

      {/* {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && <p className="text-sm text-text-muted">Loading appointments...</p>} */}
      <Card>
        <h2 className="text-base font-bold text-text mb-4">Book an appointment</h2>
        <form onSubmit={requestAppointment} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value, clinicianId: '' })} required><option value="">Choose clinical role</option>{clinicianRoles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}</select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.clinicianId} onChange={(event) => setForm({ ...form, clinicianId: event.target.value })} required disabled={!form.role}><option value="">{form.role ? 'Choose a clinician' : 'Choose a role first'}</option>{filteredClinicians.map((clinician) => <option key={clinician.id} value={clinician.id}>{clinician.user.firstName} {clinician.user.lastName}</option>)}</select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={form.mode} onChange={(event) => setForm({ ...form, mode: event.target.value as AppointmentMode })}><option value="VIDEO">Video consultation</option><option value="AUDIO">Audio consultation</option><option value="IN_PERSON">In person</option></select>
          <label className="flex flex-col gap-1 text-xs font-semibold text-text-muted">From<input className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal text-text" type="datetime-local" value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} required /></label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-text-muted">To<input className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal text-text" type="datetime-local" value={form.endTime} min={form.startTime || undefined} onChange={(event) => setForm({ ...form, endTime: event.target.value })} required /></label>
          <input className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2" placeholder="Reason for visit" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} />
          <Button type="submit" className="md:col-span-2">Request appointment</Button>
        </form>
        {message && <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${messageType === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{message}</p>}
      </Card>
      {!loading && !error && appointments.length === 0 && <Card><p className="text-sm text-text-muted">No appointments have been scheduled.</p></Card>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading && <p className="text-sm text-text-muted">Loading appointments...</p>}
      {appointments.map((appointment) => { const expired = new Date(appointment.endTime) <= new Date() || appointment.status === 'EXPIRED'; return <Card key={appointment.id} className="flex items-center justify-between gap-4"><div><h4 className="text-sm font-bold">{appointment.mode.replace('_', ' ')} consultation</h4><p className="text-xs text-text-muted">{appointment.clinician?.user?.firstName} {appointment.clinician?.user?.lastName}</p><p className="text-xs font-semibold text-primary mt-1">{new Date(appointment.startTime).toLocaleString()}</p><p className="text-xs text-text-muted mt-1">Status: {expired ? 'EXPIRED' : appointment.status}</p>{appointment.reason && <p className="text-xs text-text-muted mt-1">Reason: {appointment.reason}</p>}</div>{appointment.callSession && appointment.status === 'SCHEDULED' && !expired && <Button size="sm" onClick={() => navigate(`/patient/call/${appointment.callSession.id}`)}><Video className="w-4 h-4 mr-1" /> Join Call</Button>}</Card>; })}</div>
    </div>
  );
};
