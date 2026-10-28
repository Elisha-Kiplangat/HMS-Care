import { RouteObject } from 'react-router-dom';
import { ClinicianLayout } from './ClinicianLayout';
import { ClinicianTriage } from './pages/Triage';
import { ClinicianPatientList } from './pages/PatientList';
import { ClinicianPatientDetail } from './pages/PatientDetail';
import { ClinicianSchedule } from './pages/Schedule';
import { ClinicianAppointmentSchedule } from './pages/AppointmentSchedule';
import { ClinicianRefillRequests } from './pages/RefillRequests';
import { ClinicianAnalytics } from './pages/Analytics';
import { ClinicianExports } from './pages/Exports';
import { ClinicianTelemedicine } from './pages/Telemedicine';

export const clinicianRoutes: RouteObject = {
  path: 'clinician',
  element: <ClinicianLayout />,
  children: [
    { index: true, element: <ClinicianTriage /> },
    { path: 'patients', element: <ClinicianPatientList /> },
    { path: 'patients/:id', element: <ClinicianPatientDetail /> },
    { path: 'schedule', element: <ClinicianSchedule /> },
    { path: 'appointments', element: <ClinicianAppointmentSchedule /> },
    { path: 'refills', element: <ClinicianRefillRequests /> },
    { path: 'analytics', element: <ClinicianAnalytics /> },
    { path: 'exports', element: <ClinicianExports /> },
    { path: 'telemedicine/:sessionId', element: <ClinicianTelemedicine /> },
  ],
};
