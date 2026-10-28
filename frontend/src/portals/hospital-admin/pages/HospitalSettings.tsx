import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { tenantService } from '../../../services/tenantService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuthStore } from '../../../store/authStore';

export const HospitalSettings: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [settings, setSettings] = useState<any>({ glucoseUnits: 'mmol/L', pharmacyContact: '' });
  useEffect(() => { if (user?.tenantId) tenantService.getTenant(user.tenantId).then((tenant) => setSettings(tenant.settings || settings)); }, [user?.tenantId]);
  const save = async (event: React.FormEvent) => { event.preventDefault(); if (user?.tenantId) setSettings(await tenantService.updateSettings(user.tenantId, settings)); };
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text">Hospital Settings</h1>
      <Card><form onSubmit={save} className="grid gap-4"><Input label="Glucose units" value={settings.glucoseUnits || ''} onChange={(e) => setSettings({ ...settings, glucoseUnits: e.target.value })} /><Input label="Pharmacy contact" value={settings.pharmacyContact || ''} onChange={(e) => setSettings({ ...settings, pharmacyContact: e.target.value })} /><Button type="submit">Save settings</Button></form></Card>
    </div>
  );
};
