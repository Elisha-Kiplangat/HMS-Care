import React, { useState } from 'react';
import { authService } from '../../../services/authService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authService.forgotPassword(email);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-text">Forgot Password</h2>
        {sent ? (
          <p className="text-sm text-emerald-600 font-medium">Password reset instructions have been sent to your email.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit">Send Reset Link</Button>
          </form>
        )}
      </Card>
    </div>
  );
};
