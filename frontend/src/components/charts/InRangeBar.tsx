import React from 'react';
import { cn } from '../../utils/cn';

export interface InRangeBarProps {
  lowPercent: number;
  inRangePercent: number;
  highPercent: number;
  veryHighPercent?: number;
  className?: string;
  showLabels?: boolean;
}

export const InRangeBar: React.FC<InRangeBarProps> = ({
  lowPercent,
  inRangePercent,
  highPercent,
  veryHighPercent = 0,
  className,
  showLabels = true,
}) => {
  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      <div className="h-3 w-full bg-surface-hover rounded-full overflow-hidden flex shadow-inner">
        {lowPercent > 0 && (
          <div
            style={{ width: `${lowPercent}%` }}
            className="bg-red-500 transition-all duration-500"
            title={`Low: ${lowPercent}%`}
          />
        )}
        {inRangePercent > 0 && (
          <div
            style={{ width: `${inRangePercent}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`In Range: ${inRangePercent}%`}
          />
        )}
        {highPercent > 0 && (
          <div
            style={{ width: `${highPercent}%` }}
            className="bg-amber-500 transition-all duration-500"
            title={`High: ${highPercent}%`}
          />
        )}
        {veryHighPercent > 0 && (
          <div
            style={{ width: `${veryHighPercent}%` }}
            className="bg-red-700 transition-all duration-500"
            title={`Very High: ${veryHighPercent}%`}
          />
        )}
      </div>

      {showLabels && (
        <div className="flex items-center justify-between text-[11px] font-medium text-text-muted px-0.5">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Low {lowPercent}%</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>In Range {inRangePercent}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>High {highPercent}%</span>
          </div>
          {veryHighPercent > 0 && (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-700" />
              <span>Very High {veryHighPercent}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
