import React from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface border border-dashed border-border rounded-card">
      {icon && <div className="mb-3 text-text-muted p-3 bg-surface-hover rounded-full">{icon}</div>}
      <h4 className="text-base font-semibold text-text">{title}</h4>
      {description && <p className="text-xs text-text-muted mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
