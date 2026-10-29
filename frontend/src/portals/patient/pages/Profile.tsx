import React from 'react';
import { LogOut } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';

export const PatientProfile: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-text">Patient Profile</h1>
        <p className="text-xs text-text-muted mt-1">Personal and health information</p>
      </div>

      <Card className="flex items-center gap-4 w-full max-w-2xl">
        <Avatar name={user ? `${user.firstName} ${user.lastName}` : 'Patient'} size="lg" />
        <div>
          <h3 className="text-lg font-bold">{user?.firstName} {user?.lastName}</h3>
          <p className="text-xs text-text-muted">{user?.email}</p>
          <span className="text-xs font-semibold text-primary mt-1 inline-block">MRN: EMB-2024-8821</span>
        </div>
      </Card>

      <Button type="button" variant="outline" className="w-full max-w-2xl justify-center sm:w-fit" onClick={logout}>
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </Button>
    </div>
  );
};
