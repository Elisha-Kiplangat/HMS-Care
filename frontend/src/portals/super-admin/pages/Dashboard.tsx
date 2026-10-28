import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { tenantService } from '../../../services/tenantService';

export const SuperAdminDashboard: React.FC = () => {
  const [tenants, setTenants] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  useEffect(() => { Promise.all([tenantService.getTenants(), tenantService.getPlatformAdmins()]).then(([loadedTenants, loadedAdmins]) => { setTenants(loadedTenants); setAdmins(loadedAdmins); }); }, []);
  const users = tenants.reduce((total, tenant) => total + (tenant._count?.users || 0), 0);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text">Super Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <span className="text-xs text-text-muted font-bold uppercase">Active Hospitals</span>
          <p className="text-3xl font-black mt-2">{tenants.filter((tenant) => tenant.status === 'ACTIVE').length}</p>
        </Card>
        <Card>
          <span className="text-xs text-text-muted font-bold uppercase">Platform Admins</span>
          <p className="text-3xl font-black mt-2">{admins.length}</p>
        </Card>
        <Card>
          <span className="text-xs text-text-muted font-bold uppercase">Total Users</span>
          <p className="text-3xl font-black mt-2">{users}</p>
        </Card>
      </div>
    </div>
  );
};
