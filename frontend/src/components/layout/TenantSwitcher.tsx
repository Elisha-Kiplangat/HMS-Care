import React from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface TenantOption {
  id: string;
  name: string;
  slug: string;
}

export interface TenantSwitcherProps {
  tenants?: TenantOption[];
  activeTenantId?: string;
  onSelectTenant?: (id: string) => void;
  className?: string;
}

export const TenantSwitcher: React.FC<TenantSwitcherProps> = ({
  tenants = [{ id: 'embu-level-5', name: 'Embu Level 5 Hospital', slug: 'embu-level-5' }],
  activeTenantId = 'embu-level-5',
  onSelectTenant,
  className,
}) => {
  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  return (
    <div className={cn('relative inline-block text-left', className)}>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface-hover/80 text-text text-xs font-semibold shadow-xs hover:bg-surface-hover transition-colors cursor-pointer">
        <Building2 className="w-3.5 h-3.5 text-primary" />
        <select
          value={activeTenant?.id}
          onChange={(e) => onSelectTenant?.(e.target.value)}
          className="bg-transparent border-none text-xs font-semibold text-text focus:outline-none cursor-pointer pr-4 appearance-none"
        >
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id} className="bg-surface text-text">
              {tenant.name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-text-muted pointer-events-none -ml-4" />
      </div>
    </div>
  );
};
