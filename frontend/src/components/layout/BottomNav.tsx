import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Activity, Pill, Calendar, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { name: 'Home', path: '/patient', icon: Home },
    { name: 'Log', path: '/patient/log-glucose', icon: Activity },
    { name: 'Meds', path: '/patient/medications', icon: Pill },
    { name: 'Visits', path: '/patient/appointments', icon: Calendar },
    { name: 'Profile', path: '/patient/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around py-2 z-30 shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/patient'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-primary font-bold' : 'text-text-muted hover:text-text'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
