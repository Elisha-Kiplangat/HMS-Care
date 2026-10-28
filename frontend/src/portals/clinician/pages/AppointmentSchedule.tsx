import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { appointmentService } from '../../../services/appointmentService';

export const ClinicianAppointmentSchedule: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setAppointments(await appointmentService.getAppointments(true));
    } catch {
      setError('Appointments could not be loaded.');
    }
  };

  useEffect(() => { void load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await appointmentService.updateStatus(id, status);
      await load();
    } catch {
      setError('Appointment status could not be updated.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Appointment schedule</h1>
        <p className="text-xs text-text-muted mt-1">Review appointment requests and join approved virtual visits.</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Card>
        <div className="flex flex-col gap-3">
          {appointments.length === 0 && <p className="text-sm text-text-muted">No appointments in the queue.</p>}
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex flex-col gap-3 border-b border-border pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold">{appointment.patient?.user?.firstName} {appointment.patient?.user?.lastName}</p>
                <p className="text-xs text-text-muted">{new Date(appointment.startTime).toLocaleString()} · {appointment.mode.replace('_', ' ')}</p>
                <p className="text-xs text-text-muted">Status: {new Date(appointment.endTime) <= new Date() ? 'EXPIRED' : appointment.status}</p>
                {appointment.reason && <p className="text-xs text-text-muted">Reason: {appointment.reason}</p>}
              </div>
              <div className="flex gap-2">
                {appointment.status === 'REQUESTED' && <Button size="sm" onClick={() => void updateStatus(appointment.id, 'SCHEDULED')}>Approve</Button>}
                {appointment.callSession && appointment.status === 'SCHEDULED' && new Date(appointment.endTime) > new Date() && <Link to={`/clinician/telemedicine/${appointment.callSession.id}`}><Button size="sm" variant="outline">Join call</Button></Link>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ClinicianAppointmentSchedule;
