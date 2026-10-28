import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  className,
  variant = 'ghost',
  size = 'md',
  disabled,
  ariaLabel,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-800',
    secondary: 'bg-surface hover:bg-surface-hover text-text border border-border',
    outline: 'border border-primary text-primary hover:bg-primary/10',
    ghost: 'hover:bg-surface-hover text-text-muted hover:text-text',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50',
  };

  const sizes = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base',
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
