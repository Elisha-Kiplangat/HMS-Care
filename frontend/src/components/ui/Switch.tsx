import React from 'react';
import { cn } from '../../utils/cn';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          'w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200',
          checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
        )}
      >
        <div
          className={cn(
            'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </div>
      {label && <span className="text-sm font-medium text-text">{label}</span>}
    </label>
  );
};
