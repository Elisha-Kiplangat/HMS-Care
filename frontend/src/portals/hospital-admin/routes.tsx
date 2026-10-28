import { RouteObject } from 'react-router-dom';
import { HospitalAdminLayout } from './HospitalAdminLayout';
import { HospitalAdminDashboard } from './pages/Dashboard';
import { HospitalClinicians } from './pages/Clinicians';
import { HospitalPatients } from './pages/Patients';
import { HospitalInvitations } from './pages/Invitations';
import { HospitalReports } from './pages/Reports';
import { HospitalSettings } from './pages/HospitalSettings';

export const hospitalAdminRoutes: RouteObject = {
  path: 'hospital-admin',
  element: <HospitalAdminLayout />,
  children: [
    { index: true, element: <HospitalAdminDashboard /> },
    { path: 'clinicians', element: <HospitalClinicians /> },
    { path: 'patients', element: <HospitalPatients /> },
    { path: 'invitations', element: <HospitalInvitations /> },
    { path: 'reports', element: <HospitalReports /> },
    { path: 'hospital-settings', element: <HospitalSettings /> },
  ],
};
