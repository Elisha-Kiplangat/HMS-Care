import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';

export const RegisterPatient: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', tenantSlug: '', dateOfBirth: '', sex: '' });
  const [hospitals, setHospitals] = useState<Array<{ name: string; slug: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hospitalsLoading, setHospitalsLoading] = useState(true);
  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [field]: event.target.value });

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        setHospitals(await authService.getRegistrationHospitals());
      } catch {
        setError('Hospitals could not be loaded. Please try again later.');
      } finally {
        setHospitalsLoading(false);
      }
    };

    void loadHospitals();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { confirmPassword, ...registrationData } = form;
      await authService.registerPatient(registrationData);
      navigate('/register/patient/success');
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Registration could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6">
        <h1 className="text-2xl font-bold text-text">Patient registration</h1>
        <p className="text-sm text-text-muted mt-1 mb-6">Use your hospital slug. Your account stays pending until the hospital verifies it.</p>
        {error && <div className="p-3 mb-4 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-3"><Input label="First name" value={form.firstName} onChange={update('firstName')} required /><Input label="Last name" value={form.lastName} onChange={update('lastName')} required /></div>
          <Input label="Email" type="email" value={form.email} onChange={update('email')} required />
          <Input label="Password" type="password" minLength={8} value={form.password} onChange={update('password')} required />
          <Input label="Confirm password" type="password" minLength={8} value={form.confirmPassword} onChange={update('confirmPassword')} required className={
          form.confirmPassword && form.password !== form.confirmPassword
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : ''
        }/>
          <label className="grid gap-1 text-sm font-normal text-text">
            <span className="text-xs font-bold text-gray-500">Hospital</span>
            <select
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-normal text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={form.tenantSlug}
              onChange={update('tenantSlug')}
              required
              disabled={hospitalsLoading}
            >
              <option value="" disabled>{hospitalsLoading ? 'Loading hospitals...' : 'Select your hospital'}</option>
              {hospitals.map((hospital) => <option key={hospital.slug} value={hospital.slug}>{hospital.name}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3"><Input label="Date of birth" type="date" value={form.dateOfBirth} onChange={update('dateOfBirth')} required />
          
          <label className="grid gap-1 text-sm font-normal text-text">
            <span className="text-xs font-bold text-gray-500 ">Gender</span>
            <select
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-normal text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={form.sex}
              onChange={update('sex')}
              required
            >
              <option value="" disabled></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          </div>
          <Button type="submit" disabled={loading || !form.password || !form.confirmPassword || form.password !== form.confirmPassword}>{loading ? 'Submitting...' : 'Submit registration'}</Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/login')}>Back to login</Button>
        </form>
      </Card>
    </div>
  );
};

export const PatientRegistrationSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-text">Registration submitted</h1>
        <p className="text-sm text-text-muted mt-2 mb-6">
          Your hospital must verify and activate your account before you can sign in.
        </p>
        <Button type="button" className="w-full" onClick={() => navigate('/login')}>
          Back to login
        </Button>
      </Card>
    </div>
  );
};
