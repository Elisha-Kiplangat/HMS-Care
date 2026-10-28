import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { apiClient } from '../../../services/apiClient';
import { userService } from '../../../services/userService';

export const HospitalInvitations: React.FC = () => {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: 'DIABETOLOGIST' });
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyLabel, setCopyLabel] = useState('Copy link');
  const load = async () => { try { const response = await apiClient.get<any[]>('/invitations'); setInvitations(response.data.filter((item) => ['DIABETOLOGIST', 'DIABETES_NURSE_EDUCATOR', 'CLINICAL_NUTRITIONIST'].includes(item.role))); } catch { setError('Invitations could not be loaded.'); } };
  useEffect(() => { void load(); }, []);
  const invite = async (event: React.FormEvent) => { event.preventDefault(); setError(null); setMessage(null); try { const result = await userService.inviteUser(form); setInvitationUrl(result.invitationUrl || null); setMessage('Clinician invitation created. Share the one-time link below.'); setForm({ firstName: '', lastName: '', email: '', role: 'DIABETOLOGIST' }); await load(); } catch (requestError: any) { setError(requestError.response?.data?.message || 'Clinician invitation could not be created.'); } };
  const copyInvitation = async () => { if (!invitationUrl) return; await navigator.clipboard.writeText(invitationUrl); setCopyLabel('Copied'); window.setTimeout(() => setCopyLabel('Copy link'), 1800); };
  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-bold text-text">Invite a clinician</h1><p className="text-xs text-text-muted mt-1">Create a one-time invitation for a clinician to join this hospital.</p></div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Card><form onSubmit={invite} className="grid md:grid-cols-2 gap-3"><Input label="First name" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} required /><Input label="Last name" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} required /><Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /><Select label="Clinician role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} options={[{ value: 'DIABETOLOGIST', label: 'Diabetologist' }, { value: 'DIABETES_NURSE_EDUCATOR', label: 'Nurse educator' }, { value: 'CLINICAL_NUTRITIONIST', label: 'Clinical nutritionist' }]} /><Button type="submit" className="md:col-span-2">Create clinician invitation</Button></form></Card>
      {message && invitationUrl && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="invitation-title"><Card className="w-full max-w-lg"><div className="flex items-start justify-between gap-4"><div><h2 id="invitation-title" className="text-lg font-bold text-text">Invitation link created</h2><p className="text-sm text-text-muted mt-1">This one-time link expires in 7 days.</p></div><button type="button" className="text-xl text-text-muted" aria-label="Close" onClick={() => setInvitationUrl(null)}>×</button></div><div className="mt-4 flex flex-col gap-3 sm:flex-row"><input readOnly value={invitationUrl} className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" /><Button type="button" onClick={() => void copyInvitation()}>{copyLabel}</Button></div><p className="text-xs text-primary mt-3">{message}</p></Card></div>}
      <Card className="p-0 overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-surface-hover"><tr><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Expires</th></tr></thead><tbody className="divide-y divide-border">{invitations.map((item) => <tr key={item.id}><td className="p-4">{item.email}</td><td className="p-4">{item.role}</td><td className="p-4">{item.status}</td><td className="p-4">{new Date(item.expiresAt).toLocaleDateString()}</td></tr>)}</tbody></table></Card>
    </div>
  );
};
