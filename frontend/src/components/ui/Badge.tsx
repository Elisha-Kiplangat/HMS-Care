import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-surface-hover text-text border border-border',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300',
    danger: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-300',
    info: 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-950 dark:text-blue-300',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-semibold gap-1', variants[variant], className)}>
      {children}
    </span>
  );
};
