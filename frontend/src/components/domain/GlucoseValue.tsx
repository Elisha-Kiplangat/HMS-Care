import React from 'react';
import { ArrowDown, ArrowUp, Check, ArrowUpRight } from 'lucide-react';
import { convertGlucose, GlucoseUnit } from '../../utils/glucoseUnits';

export interface GlucoseValueProps {
  valueInMmol: number;
  unit?: GlucoseUnit;
}

export const GlucoseValue: React.FC<GlucoseValueProps> = ({ valueInMmol, unit = 'mmol/L' }) => {
  const displayVal = convertGlucose(valueInMmol, unit);

  let status: 'low' | 'inRange' | 'high' | 'veryHigh' = 'inRange';
  if (valueInMmol < 3.9) status = 'low';
  else if (valueInMmol > 13.9) status = 'veryHigh';
  else if (valueInMmol > 10.0) status = 'high';

  const styles = {
    low: { bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 text-red-700 dark:text-red-400', icon: ArrowDown, label: 'Low' },
    inRange: { bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-700 dark:text-emerald-400', icon: Check, label: 'In range' },
    high: { bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-700 dark:text-amber-400', icon: ArrowUp, label: 'High' },
    veryHigh: { bg: 'bg-red-100 dark:bg-red-900/60 border-red-300 text-red-800 dark:text-red-300', icon: ArrowUpRight, label: 'Very high' },
  };

  const curr = styles[status];
  const Icon = curr.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium ${curr.bg}`}>
      <span className="text-xl font-bold tracking-tight">{displayVal}</span>
      <span className="text-xs font-semibold">{unit}</span>
      <div className="flex items-center gap-1 text-xs font-semibold border-l border-current/20 pl-2 ml-1">
        <Icon className="w-4 h-4 stroke-[2.5]" />
        <span>{curr.label}</span>
      </div>
    </div>
  );
};
