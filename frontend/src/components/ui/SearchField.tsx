import React from 'react';
import { Search } from 'lucide-react';
import { InputProps } from './Input';

export const SearchField: React.FC<InputProps> = (props) => {
  return (
    <div className="relative w-full">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        {...props}
        className="w-full pl-9 pr-3.5 py-2 bg-surface border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        placeholder={props.placeholder || 'Search...'}
      />
    </div>
  );
};
