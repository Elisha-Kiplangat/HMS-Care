import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeRole } = useAuthStore();
  const isPatient = activeRole === UserRole.PATIENT;

  return (
    <div className="min-h-screen bg-background flex text-text">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Topbar />
        <main className="p-4 md:p-8 flex-1 w-full">{children}</main>
      </div>
      {isPatient && <BottomNav />}
    </div>
  );
};
