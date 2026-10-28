import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { tenantService } from '../../../services/tenantService';
import { Tenant } from '../../../types';
import { Link } from 'react-router-dom';

export const SuperAdminTenants: React.FC = () => {
  const [tenants, setTenants] = useState<(Tenant & { _count?: { users: number; patients: number; clinicians: number } })[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [message, setMessage] = useState('');
  const load = () => tenantService.getTenants().then(setTenants);
  useEffect(() => { void load(); }, []);
  const create = async (event: React.FormEvent) => { event.preventDefault(); const result = await tenantService.createTenant({ name, slug, adminEmail }); setMessage(result.adminInvitationToken ? `Hospital created. Admin invitation token: ${result.adminInvitationToken}` : 'Hospital created.'); setName(''); setSlug(''); setAdminEmail(''); load(); };
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text">Tenants (Hospitals)</h1>
      <Card><form onSubmit={create} className="grid md:grid-cols-4 gap-3"><Input label="Hospital name" value={name} onChange={(e) => setName(e.target.value)} required /><Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required /><Input label="Hospital Admin email" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required /><Button type="submit" className="self-end">Create hospital</Button></form>{message && <p className="text-xs text-primary mt-3 break-all">{message}</p>}</Card>
      <Card className="p-0 overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-surface-hover"><tr><th className="p-4">Hospital</th><th className="p-4">Status</th><th className="p-4">Users</th><th className="p-4">Patients</th><th className="p-4" /></tr></thead><tbody className="divide-y divide-border">{tenants.map((tenant) => <tr key={tenant.id}><td className="p-4 font-semibold">{tenant.name}<span className="block text-xs text-text-muted">{tenant.slug}</span></td><td className="p-4">{tenant.status}</td><td className="p-4">{tenant._count?.users || 0}</td><td className="p-4">{tenant._count?.patients || 0}</td><td className="p-4"><Link className="text-primary" to={`/super-admin/tenants/${tenant.id}`}>Manage</Link></td></tr>)}</tbody></table></Card>
    </div>
  );
};
