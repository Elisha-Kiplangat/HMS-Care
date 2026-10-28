import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (range: DateRange) => void;
  className?: string;
  label?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  className,
  label,
}) => {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <label className="text-xs font-semibold text-text-muted">{label}</label>}
      <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-lg p-1.5 shadow-sm">
        <Calendar className="w-4 h-4 text-text-muted ml-1" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChange({ startDate: e.target.value, endDate })}
          className="bg-transparent text-xs text-text border-none focus:outline-none p-1 font-medium"
        />
        <span className="text-xs text-text-muted font-bold">–</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChange({ startDate, endDate: e.target.value })}
          className="bg-transparent text-xs text-text border-none focus:outline-none p-1 font-medium"
        />
      </div>
    </div>
  );
};
