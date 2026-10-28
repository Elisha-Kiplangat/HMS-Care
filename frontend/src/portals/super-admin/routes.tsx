import { RouteObject } from 'react-router-dom';
import { SuperAdminLayout } from './SuperAdminLayout';
import { SuperAdminDashboard } from './pages/Dashboard';
import { SuperAdminTenants } from './pages/Tenants';
import { SuperAdminTenantDetail } from './pages/TenantDetail';
import { SuperAdminPlatformAdmins } from './pages/PlatformAdmins';
import { SuperAdminAuditLogs } from './pages/AuditLogs';
import { SuperAdminSystemSettings } from './pages/SystemSettings';

export const superAdminRoutes: RouteObject = {
  path: 'super-admin',
  element: <SuperAdminLayout />,
  children: [
    { index: true, element: <SuperAdminDashboard /> },
    { path: 'tenants', element: <SuperAdminTenants /> },
    { path: 'tenants/:id', element: <SuperAdminTenantDetail /> },
    { path: 'platform-admins', element: <SuperAdminPlatformAdmins /> },
    { path: 'audit-logs', element: <SuperAdminAuditLogs /> },
    { path: 'system-settings', element: <SuperAdminSystemSettings /> },
  ],
};
