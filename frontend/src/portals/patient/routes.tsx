import { RouteObject } from 'react-router-dom';
import { PatientLayout } from './PatientLayout';
import { PatientHome } from './pages/Home';
import { LogGlucose } from './pages/LogGlucose';
import { PatientHba1c } from './pages/Hba1c';
import { PatientMedications } from './pages/Medications';
import { PatientRefills } from './pages/Refills';
import { PatientAppointments } from './pages/Appointments';
import { PatientCall } from './pages/Call';
import { PatientProfile } from './pages/Profile';

export const patientRoutes: RouteObject = {
  path: 'patient',
  element: <PatientLayout />,
  children: [
    { index: true, element: <PatientHome /> },
    { path: 'log-glucose', element: <LogGlucose /> },
    { path: 'hba1c', element: <PatientHba1c /> },
    { path: 'medications', element: <PatientMedications /> },
    { path: 'refills', element: <PatientRefills /> },
    { path: 'appointments', element: <PatientAppointments /> },
    { path: 'call/:sessionId', element: <PatientCall /> },
    { path: 'profile', element: <PatientProfile /> },
  ],
};
