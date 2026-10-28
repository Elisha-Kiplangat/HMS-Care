import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { tenantService } from '../../../services/tenantService';
import { userService } from '../../../services/userService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Tenant } from '../../../types';

export const SuperAdminPlatformAdmins: React.FC = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ firstName: '', lastName: '', phone: '' });
  const load = async () => setAdmins(await tenantService.getPlatformAdmins());
  useEffect(() => { void load(); void tenantService.getTenants().then((items) => { setTenants(items); if (items[0]) setTenantId(items[0].id); }); }, []);

  const invite = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const result = await userService.inviteUser({ email, role: 'HOSPITAL_ADMIN', tenantId, phone, firstName, lastName });
      setFirstName(''); setLastName(''); setEmail(''); setPhone('');
      setMessage(result.invitationUrl ? `Invitation link created. Share this one-time link with the administrator: ${result.invitationUrl}` : 'Hospital Admin invitation created.');
      await load();
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Admin invitation could not be created.');
    }
  };

  const startEdit = (admin: any) => { setEditingId(admin.id); setEditValues({ firstName: admin.firstName, lastName: admin.lastName, phone: admin.phone || '' }); };
  const saveEdit = async (id: string) => {
    try { await userService.updateUser(id, editValues); setEditingId(null); await load(); setMessage('Administrator details updated.'); }
    catch (requestError: any) { setError(requestError.response?.data?.message || 'Administrator could not be updated.'); }
  };
  const resetPassword = async (id: string) => {
    try { const result = await userService.createPasswordReset(id); setMessage(`Password reset token (expires in ${result.expiresIn}): ${result.resetToken}`); }
    catch (requestError: any) { setError(requestError.response?.data?.message || 'Password reset could not be created.'); }
  };
  const deactivate = async (admin: any) => {
    if (!window.confirm(`Deactivate ${admin.firstName} ${admin.lastName}?`)) return;
    try { await userService.deactivateUser(admin.id); await load(); setMessage('Administrator deactivated.'); }
    catch (requestError: any) { setError(requestError.response?.data?.message || 'Administrator could not be deactivated.'); }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text">Platform Admins</h1>
      <Card><form onSubmit={invite} className="grid gap-4 md:grid-cols-2"><Input label="First name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required /><Input label="Last name" value={lastName} onChange={(event) => setLastName(event.target.value)} required /><Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /><Input label="Phone number" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} /><Select label="Hospital" value={tenantId} onChange={(event) => setTenantId(event.target.value)} options={tenants.map((tenant) => ({ value: tenant.id, label: tenant.name }))} /><div className="flex items-end"><Button type="submit" className="w-full" disabled={!tenantId}>Invite Hospital Admin</Button></div></form><p className="mt-3 text-xs text-text-muted">No password is created here. The administrator sets a password through the one-time invitation token.</p>{message && <p className="mt-3 text-xs text-primary break-all">{message}</p>}{error && <p className="mt-3 text-xs text-red-600">{error}</p>}</Card>
      <Card className="p-0 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-surface-hover"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Hospital</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody className="divide-y divide-border">{admins.map((admin) => <tr key={admin.id}>{editingId === admin.id ? <><td className="p-4"><div className="flex gap-2"><Input value={editValues.firstName} onChange={(event) => setEditValues({ ...editValues, firstName: event.target.value })} /><Input value={editValues.lastName} onChange={(event) => setEditValues({ ...editValues, lastName: event.target.value })} /></div></td><td className="p-4">{admin.email}</td><td className="p-4">{tenants.find((tenant) => tenant.id === admin.tenantId)?.name || '—'}</td><td className="p-4">{admin.status}</td><td className="p-4"><div className="flex gap-2"><Button size="sm" onClick={() => void saveEdit(admin.id)}>Save</Button><Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button></div></td></> : <><td className="p-4 font-semibold">{admin.firstName} {admin.lastName}<span className="block text-xs text-text-muted">{admin.phone || 'No phone'}</span></td><td className="p-4">{admin.email}</td><td className="p-4">{tenants.find((tenant) => tenant.id === admin.tenantId)?.name || '—'}</td><td className="p-4">{admin.status}</td><td className="p-4"><div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => startEdit(admin)}>Update</Button><Button size="sm" variant="secondary" onClick={() => void resetPassword(admin.id)}>Reset password</Button>{admin.status !== 'DEACTIVATED' && <Button size="sm" variant="danger" onClick={() => void deactivate(admin)}>Deactivate</Button>}</div></td></>}</tr>)}</tbody></table></div></Card>
    </div>
  );
};
