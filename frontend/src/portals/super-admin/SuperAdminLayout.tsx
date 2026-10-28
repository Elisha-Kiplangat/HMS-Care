import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';

export const SuperAdminLayout: React.FC = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};
