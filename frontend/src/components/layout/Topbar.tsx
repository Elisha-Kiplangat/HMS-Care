import React from 'react';
import { Sun, Moon, Globe } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { Avatar } from '../ui/Avatar';

export const Topbar: React.FC = () => {
  const { user } = useAuthStore();
  const { theme, toggleTheme, locale, setLocale, glucoseUnit, setGlucoseUnit } = useUIStore();

  return (
    <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full">
          Embu Level 5 Hospital
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setGlucoseUnit(glucoseUnit === 'mmol/L' ? 'mg/dL' : 'mmol/L')}
          className="px-2.5 py-1 text-xs font-bold border border-border rounded-lg bg-surface-hover text-text"
        >
          {glucoseUnit}
        </button>

        <button
          onClick={() => setLocale(locale === 'en' ? 'sw' : 'en')}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold border border-border rounded-lg bg-surface-hover text-text"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{locale.toUpperCase()}</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 border border-border rounded-lg bg-surface-hover text-text"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {user && (
          <div className="flex items-center gap-3 border-l border-border pl-3">
            <Avatar name={`${user.firstName} ${user.lastName}`} size="sm" />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-text">{user.firstName} {user.lastName}</span>
              <span className="text-[10px] text-text-muted">{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
