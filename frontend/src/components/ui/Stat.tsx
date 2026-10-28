import React from 'react';
import { cn } from '../../utils/cn';

export interface StatProps {
  label: string;
  value: string | number;
  subtext?: string;
  className?: string;
}

export const Stat: React.FC<StatProps> = ({ label, value, subtext, className }) => {
  return (
    <div className={cn('flex flex-col gap-1 p-4 bg-surface border border-border rounded-card', className)}>
      <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</span>
      <span className="text-2xl font-bold text-text">{value}</span>
      {subtext && <span className="text-xs text-text-muted">{subtext}</span>}
    </div>
  );
};
