import React from 'react';
import { Calendar, Clock, Video, Phone, User as UserIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Appointment, AppointmentMode, AppointmentStatus } from '../../types';
import { formatDate, formatTime } from '../../utils/date';

export interface AppointmentCardProps {
  appointment: Appointment;
  onJoinCall?: (sessionId: string) => void;
  onCancel?: (id: string) => void;
  isClinicianView?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onJoinCall,
  onCancel,
  isClinicianView = false,
}) => {
  const modeIcons = {
    [AppointmentMode.VIDEO]: <Video className="w-4 h-4 text-primary" />,
    [AppointmentMode.AUDIO]: <Phone className="w-4 h-4 text-primary" />,
    [AppointmentMode.IN_PERSON]: <UserIcon className="w-4 h-4 text-primary" />,
  };

  const statusVariants: Record<AppointmentStatus, 'success' | 'warning' | 'default' | 'danger'> = {
    [AppointmentStatus.REQUESTED]: 'warning',
    [AppointmentStatus.SCHEDULED]: 'success',
    [AppointmentStatus.EXPIRED]: 'danger',
    [AppointmentStatus.COMPLETED]: 'default',
    [AppointmentStatus.CANCELLED]: 'danger',
  };

  const name = isClinicianView
    ? `${appointment.patientUser?.firstName || 'Patient'} ${appointment.patientUser?.lastName || ''}`
    : `${appointment.clinicianUser?.firstName || 'Dr.'} ${appointment.clinicianUser?.lastName || 'Clinician'}`;

  return (
    <Card className="flex flex-col gap-4 border-border hover:border-primary/40 transition-all shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            {modeIcons[appointment.mode]}
          </div>
          <div>
            <h4 className="text-sm font-bold text-text">{name}</h4>
            <span className="text-xs text-text-muted capitalize">
              {appointment.mode.toLowerCase().replace('_', ' ')} consultation
            </span>
          </div>
        </div>
        <Badge variant={statusVariants[appointment.status]}>
          {appointment.status}
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-xs text-text-muted border-t border-b border-border/60 py-2.5">
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>{formatDate(appointment.startTime)}</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>{formatTime(appointment.startTime)}</span>
        </div>
      </div>

      {appointment.notes && (
        <p className="text-xs text-text-muted italic bg-surface-hover/60 p-2 rounded-lg">
          "{appointment.notes}"
        </p>
      )}

      {appointment.status === AppointmentStatus.SCHEDULED && new Date(appointment.endTime) > new Date() && (
        <div className="flex items-center justify-end gap-2 pt-1">
          {onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(appointment.id)}
              className="text-xs"
            >
              Cancel
            </Button>
          )}
          {onJoinCall && appointment.mode !== AppointmentMode.IN_PERSON && (
            <Button
              size="sm"
              onClick={() => onJoinCall(appointment.id)}
              className="text-xs font-semibold"
            >
              Join Session
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
