import React from 'react';
import { Navigate } from 'react-router-dom';

export const ClinicianSchedule: React.FC = () => {
  return <Navigate to="/clinician/appointments" replace />;
};
