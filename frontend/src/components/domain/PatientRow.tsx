import React from 'react';
import { ChevronRight } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { Avatar } from '../ui/Avatar';
import { RiskTier } from '../../types';

export interface PatientRowProps {
  id: string;
  name: string;
  mrn?: string;
  age?: number;
  gender?: string;
  tier: RiskTier;
  hba1c?: string | number;
  timeInRange?: number;
  lastReading?: string;
  onClick?: () => void;
}

export const PatientRow: React.FC<PatientRowProps> = ({
  name,
  mrn,
  age,
  gender,
  tier,
  hba1c,
  timeInRange,
  lastReading,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-surface hover:bg-surface-hover/80 border border-border rounded-xl transition-all cursor-pointer group shadow-xs"
    >
      <div className="flex items-center gap-3.5">
        <Avatar name={name} size="md" />
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-text group-hover:text-primary transition-colors">
              {name}
            </h4>
            {mrn && <span className="text-[11px] px-2 py-0.5 rounded bg-surface-hover text-text-muted font-mono">{mrn}</span>}
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
            {age && <span>{age} yrs</span>}
            {gender && <span>• {gender}</span>}
            {lastReading && <span>• Last log {lastReading}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {hba1c !== undefined && (
          <div className="text-right hidden sm:block">
            <span className="block text-[10px] uppercase font-semibold text-text-muted">HbA1c</span>
            <span className="text-sm font-bold text-text">{typeof hba1c === 'number' ? `${hba1c}%` : hba1c}</span>
          </div>
        )}

        {timeInRange !== undefined && (
          <div className="text-right hidden md:block">
            <span className="block text-[10px] uppercase font-semibold text-text-muted">TIR</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{timeInRange}%</span>
          </div>
        )}

        <RiskBadge tier={tier} />

        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};
