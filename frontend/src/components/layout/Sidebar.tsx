import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Settings,
  Activity,
  Calendar,
  Pill,
  BarChart3,
  Download,
  Home,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';
import { Button } from '../ui/Button';

export const Sidebar: React.FC = () => {
  const { activeRole } = useAuthStore();
  const { logout } = useAuthStore();

  type NavigationItem = { name: string; path: string; icon: typeof LayoutDashboard; group?: string };

  const superAdminNav: NavigationItem[] = [
    { name: 'Dashboard', path: '/super-admin', icon: LayoutDashboard, group: 'Overview' },
    { name: 'Tenants', path: '/super-admin/tenants', icon: Building2, group: 'Administration' },
    { name: 'Platform Admins', path: '/super-admin/platform-admins', icon: Users, group: 'Administration' },
    { name: 'Audit Logs', path: '/super-admin/audit-logs', icon: FileText, group: 'Governance' },
    { name: 'System Settings', path: '/super-admin/system-settings', icon: Settings, group: 'Governance' },
  ];

  const hospitalAdminNav: NavigationItem[] = [
    { name: 'Dashboard', path: '/hospital-admin', icon: LayoutDashboard },
    { name: 'Clinicians', path: '/hospital-admin/clinicians', icon: UserCheck },
    { name: 'Patients', path: '/hospital-admin/patients', icon: Users },
    { name: 'Invitations', path: '/hospital-admin/invitations', icon: FileText },
    { name: 'Reports', path: '/hospital-admin/reports', icon: BarChart3 },
    { name: 'Hospital Settings', path: '/hospital-admin/hospital-settings', icon: Settings },
  ];

  const clinicianNav: NavigationItem[] = [
    { name: 'Triage', path: '/clinician', icon: Activity },
    { name: 'Patients', path: '/clinician/patients', icon: Users },
    { name: 'Appointments', path: '/clinician/appointments', icon: Calendar },
    { name: 'Refills', path: '/clinician/refills', icon: Pill },
    { name: 'Analytics', path: '/clinician/analytics', icon: BarChart3 },
    { name: 'Exports', path: '/clinician/exports', icon: Download },
  ];

  const patientNav: NavigationItem[] = [
    { name: 'Home', path: '/patient', icon: Home },
    { name: 'Log Glucose', path: '/patient/log-glucose', icon: Activity },
    { name: 'HbA1c', path: '/patient/hba1c', icon: BarChart3 },
    { name: 'Medications', path: '/patient/medications', icon: Pill },
    { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
  ];

  let navItems = patientNav;
  if (activeRole === UserRole.SUPER_ADMIN) navItems = superAdminNav;
  else if (activeRole === UserRole.HOSPITAL_ADMIN) navItems = hospitalAdminNav;
  else if (
    activeRole === UserRole.DIABETOLOGIST ||
    activeRole === UserRole.NURSE_EDUCATOR ||
    activeRole === UserRole.NUTRITIONIST
  ) {
    navItems = clinicianNav;
  }

  return (
    <aside className="w-64 bg-surface border-r border-border hidden md:flex flex-col h-screen sticky top-0 p-4 gap-6">
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg">
          H
        </div>
        <span className="font-bold text-lg text-text">HMS Care</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.path}>
              {activeRole === UserRole.SUPER_ADMIN && (index === 0 || item.group !== navItems[index - 1].group) && <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">{item.group}</p>}
              <NavLink
                to={item.path}
                end={item.path.split('/').length <= 2}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text-muted hover:bg-surface-hover hover:text-text'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>
      <Button size="sm" variant="ghost" className="w-full justify-start gap-3 px-3" onClick={logout}>
        <LogOut className="w-4 h-4 text-text-muted" />
        <span>Log out</span>
      </Button>
    </aside>
  );
};
