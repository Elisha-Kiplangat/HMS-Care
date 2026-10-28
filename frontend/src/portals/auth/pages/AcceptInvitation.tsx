import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ShieldAlert } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { authService } from '../../../services/authService';

export const AcceptInvitation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [sex, setSex] = useState('');
  const [licenceNumber, setLicenceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.acceptInvitation({ token, password, firstName, lastName, dateOfBirth, sex, licenceNumber });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: unknown) {
      setError('Failed to accept invitation. Token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
            H
          </div>
          <h1 className="text-2xl font-black text-text tracking-tight">Accept Invitation</h1>
          <p className="text-xs text-text-muted">
            Set your password to activate your HMS Care account
          </p>
        </div>

        <Card className="p-6 shadow-xl border-border">
          {success ? (
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
              <h3 className="text-base font-bold text-text">Account Activated!</h3>
              <p className="text-xs text-text-muted">
                Your password has been set successfully. Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <Input
                label="Date of Birth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
              <Input
                label="Sex"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
              />
              <Input
                label="Professional licence number (clinicians)"
                value={licenceNumber}
                onChange={(e) => setLicenceNumber(e.target.value)}
              />
              <Input
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Button
                type="submit"
                disabled={loading || !token}
                className="w-full py-2.5 font-bold mt-2"
              >
                {loading ? 'Activating Account...' : 'Set Password & Login'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
