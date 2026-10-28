import React from 'react';
import { Card } from '../../../components/ui/Card';

export const SuperAdminSystemSettings: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text">System Settings</h1>
      <Card><p className="text-sm text-text-muted">Global platform default configurations.</p></Card>
    </div>
  );
};
