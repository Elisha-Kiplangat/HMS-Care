import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { useAuthStore } from '../../../store/authStore';

export const PatientProfile: React.FC = () => {
  const { user } = useAuthStore();

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
    </div>
  );
};
