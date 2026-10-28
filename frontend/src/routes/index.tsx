import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppShell } from '../components/layout/AppShell';

import { Login } from '../portals/auth/pages/Login';
import { ForgotPassword } from '../portals/auth/pages/ForgotPassword';
import { ResetPassword } from '../portals/auth/pages/ResetPassword';
import { AcceptInvitation } from '../portals/auth/pages/AcceptInvitation';
import { PatientRegistrationSuccess, RegisterPatient } from '../portals/auth/pages/RegisterPatient';

// Patient
import { PatientHome } from '../portals/patient/pages/Home';
import { LogGlucose } from '../portals/patient/pages/LogGlucose';
import { PatientHba1c } from '../portals/patient/pages/Hba1c';
import { PatientMedications } from '../portals/patient/pages/Medications';
import { PatientRefills } from '../portals/patient/pages/Refills';
import { PatientAppointments } from '../portals/patient/pages/Appointments';
import { PatientCall } from '../portals/patient/pages/Call';
import { PatientProfile } from '../portals/patient/pages/Profile';

// Clinician
import { ClinicianTriage } from '../portals/clinician/pages/Triage';
import { ClinicianPatientList } from '../portals/clinician/pages/PatientList';
import { ClinicianPatientDetail } from '../portals/clinician/pages/PatientDetail';
import { ClinicianSchedule } from '../portals/clinician/pages/Schedule';
import { ClinicianAppointmentSchedule } from '../portals/clinician/pages/AppointmentSchedule';
import { ClinicianRefillRequests } from '../portals/clinician/pages/RefillRequests';
import { ClinicianAnalytics } from '../portals/clinician/pages/Analytics';
import { ClinicianExports } from '../portals/clinician/pages/Exports';
import { ClinicianTelemedicine } from '../portals/clinician/pages/Telemedicine';

// Hospital Admin
import { HospitalAdminDashboard } from '../portals/hospital-admin/pages/Dashboard';
import { HospitalClinicians } from '../portals/hospital-admin/pages/Clinicians';
import { HospitalPatients } from '../portals/hospital-admin/pages/Patients';
import { HospitalInvitations } from '../portals/hospital-admin/pages/Invitations';
import { HospitalReports } from '../portals/hospital-admin/pages/Reports';
import { HospitalSettings } from '../portals/hospital-admin/pages/HospitalSettings';

// Super Admin
import { SuperAdminDashboard } from '../portals/super-admin/pages/Dashboard';
import { SuperAdminTenants } from '../portals/super-admin/pages/Tenants';
import { SuperAdminTenantDetail } from '../portals/super-admin/pages/TenantDetail';
import { SuperAdminPlatformAdmins } from '../portals/super-admin/pages/PlatformAdmins';
import { SuperAdminAuditLogs } from '../portals/super-admin/pages/AuditLogs';
import { SuperAdminSystemSettings } from '../portals/super-admin/pages/SystemSettings';

import { UserRole } from '../types';

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/accept-invitation', element: <AcceptInvitation /> },
  { path: '/register/patient', element: <RegisterPatient /> },
  { path: '/register/patient/success', element: <PatientRegistrationSuccess /> },

  // Patient Portal
  {
    element: <ProtectedRoute allowedRoles={[UserRole.PATIENT]} />,
    children: [
      { path: '/patient', element: <AppShell><PatientHome /></AppShell> },
      { path: '/patient/log-glucose', element: <AppShell><LogGlucose /></AppShell> },
      { path: '/patient/hba1c', element: <AppShell><PatientHba1c /></AppShell> },
      { path: '/patient/medications', element: <AppShell><PatientMedications /></AppShell> },
      { path: '/patient/refills', element: <AppShell><PatientRefills /></AppShell> },
      { path: '/patient/appointments', element: <AppShell><PatientAppointments /></AppShell> },
      { path: '/patient/call/:sessionId', element: <AppShell><PatientCall /></AppShell> },
      { path: '/patient/profile', element: <AppShell><PatientProfile /></AppShell> },
    ],
  },

  // Clinician Portal
  {
    element: (
      <ProtectedRoute
        allowedRoles={[
          UserRole.DIABETOLOGIST,
          UserRole.NURSE_EDUCATOR,
          UserRole.NUTRITIONIST,
        ]}
      />
    ),
    children: [
      { path: '/clinician', element: <AppShell><ClinicianTriage /></AppShell> },
      { path: '/clinician/patients', element: <AppShell><ClinicianPatientList /></AppShell> },
      { path: '/clinician/patients/:id', element: <AppShell><ClinicianPatientDetail /></AppShell> },
      { path: '/clinician/schedule', element: <AppShell><ClinicianSchedule /></AppShell> },
      { path: '/clinician/appointments', element: <AppShell><ClinicianAppointmentSchedule /></AppShell> },
      { path: '/clinician/refills', element: <AppShell><ClinicianRefillRequests /></AppShell> },
      { path: '/clinician/analytics', element: <AppShell><ClinicianAnalytics /></AppShell> },
      { path: '/clinician/exports', element: <AppShell><ClinicianExports /></AppShell> },
      { path: '/clinician/telemedicine/:sessionId', element: <AppShell><ClinicianTelemedicine /></AppShell> },
    ],
  },

  // Hospital Admin Portal
  {
    element: <ProtectedRoute allowedRoles={[UserRole.HOSPITAL_ADMIN]} />,
    children: [
      { path: '/hospital-admin', element: <AppShell><HospitalAdminDashboard /></AppShell> },
      { path: '/hospital-admin/clinicians', element: <AppShell><HospitalClinicians /></AppShell> },
      { path: '/hospital-admin/patients', element: <AppShell><HospitalPatients /></AppShell> },
      { path: '/hospital-admin/invitations', element: <AppShell><HospitalInvitations /></AppShell> },
      { path: '/hospital-admin/reports', element: <AppShell><HospitalReports /></AppShell> },
      { path: '/hospital-admin/hospital-settings', element: <AppShell><HospitalSettings /></AppShell> },
    ],
  },

  // Super Admin Portal
  {
    element: <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]} />,
    children: [
      { path: '/super-admin', element: <AppShell><SuperAdminDashboard /></AppShell> },
      { path: '/super-admin/tenants', element: <AppShell><SuperAdminTenants /></AppShell> },
      { path: '/super-admin/tenants/:id', element: <AppShell><SuperAdminTenantDetail /></AppShell> },
      { path: '/super-admin/platform-admins', element: <AppShell><SuperAdminPlatformAdmins /></AppShell> },
      { path: '/super-admin/audit-logs', element: <AppShell><SuperAdminAuditLogs /></AppShell> },
      { path: '/super-admin/system-settings', element: <AppShell><SuperAdminSystemSettings /></AppShell> },
    ],
  },

  { path: '*', element: <Navigate to="/login" replace /> },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
