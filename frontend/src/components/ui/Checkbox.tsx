import React, { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className, ...props }) => {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium select-none">
      <input
        type="checkbox"
        className={cn('w-4 h-4 text-primary border-border rounded focus:ring-primary/40', className)}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
};
