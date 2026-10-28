import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable, ...props }) => {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-card p-5 shadow-sm transition-all',
        hoverable && 'hover:shadow-md hover:border-primary/40 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
