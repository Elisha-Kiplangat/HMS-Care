import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Settings, ShieldCheck, Check } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';

export const SuperAdminTenantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState('Embu Level Five Hospital');
  const [slug, setSlug] = useState('embu-level-5');
  const [glucoseUnit, setGlucoseUnit] = useState<'MMOL_L' | 'MG_DL'>('MMOL_L');
  const [status, setStatus] = useState<'ACTIVE' | 'SUSPENDED'>('ACTIVE');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/super-admin/tenants')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tenants
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-text tracking-tight">{name}</h1>
              <Badge variant={status === 'ACTIVE' ? 'success' : 'danger'}>{status}</Badge>
            </div>
            <p className="text-xs text-text-muted mt-0.5">Tenant ID: {id || 'embu-level-5'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-text-muted uppercase">Active Patients</span>
          <span className="text-2xl font-black text-text">1,240</span>
        </Card>
        <Card className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-text-muted uppercase">Clinicians</span>
          <span className="text-2xl font-black text-text">38</span>
        </Card>
        <Card className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-text-muted uppercase">Data Sync Status</span>
          <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 mt-1">
            <ShieldCheck className="w-4 h-4" /> Healthy & Encrypted
          </span>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-base font-bold text-text mb-4 flex items-center gap-2 border-b border-border pb-3">
          <Settings className="w-4 h-4 text-primary" /> Tenant Configuration
        </h3>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Hospital / Organization Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Tenant Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Default Glucose Unit"
              value={glucoseUnit}
              onChange={(e) => setGlucoseUnit(e.target.value as 'MMOL_L' | 'MG_DL')}
              options={[
                { value: 'MMOL_L', label: 'mmol/L (Standard Kenya)' },
                { value: 'MG_DL', label: 'mg/dL' },
              ]}
            />

            <Select
              label="Tenant Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'SUSPENDED')}
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'SUSPENDED', label: 'Suspended' },
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-2">
            <Button type="submit" className="font-bold px-6">
              {isSaved ? (
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Saved!
                </span>
              ) : (
                'Save Tenant Settings'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
