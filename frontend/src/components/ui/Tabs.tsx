import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId?: string;
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId: controlledActiveId,
  defaultActiveId,
  onChange,
  className,
}) => {
  const [internalActiveId, setInternalActiveId] = useState(
    defaultActiveId || items[0]?.id || ''
  );

  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;

  const handleSelect = (id: string) => {
    if (controlledActiveId === undefined) {
      setInternalActiveId(id);
    }
    onChange?.(id);
  };

  return (
    <div className={cn('border-b border-border', className)}>
      <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {items.map((tab) => {
          const isActive = tab.id === activeId;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleSelect(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium transition-all flex items-center gap-2 border-transparent',
                isActive
                  ? 'border-primary text-primary font-semibold'
                  : 'text-text-muted hover:text-text hover:border-border',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
