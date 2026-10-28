import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { tenantService } from '../../../services/tenantService';

export const SuperAdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => { tenantService.getAuditLogs().then(setLogs); }, []);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text">Platform Audit Logs</h1>
      <Card className="p-0 overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-surface-hover"><tr><th className="p-4">Time</th><th className="p-4">Actor</th><th className="p-4">Action</th><th className="p-4">Resource</th></tr></thead><tbody className="divide-y divide-border">{logs.map((log) => <tr key={log.id}><td className="p-4 text-xs">{new Date(log.timestamp).toLocaleString()}</td><td className="p-4">{log.actor ? `${log.actor.firstName} ${log.actor.lastName}` : 'System'}</td><td className="p-4 font-semibold">{log.action}</td><td className="p-4 text-xs">{log.resource}</td></tr>)}</tbody></table></Card>
    </div>
  );
};
