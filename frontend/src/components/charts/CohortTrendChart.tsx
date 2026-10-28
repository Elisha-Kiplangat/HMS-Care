import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card } from '../ui/Card';

export interface CohortTrendPoint {
  month: string;
  avgGlucose: number;
  avgHba1c: number;
  inRangePercent: number;
}

export interface CohortTrendChartProps {
  data: CohortTrendPoint[];
  title?: string;
  height?: number;
}

export const CohortTrendChart: React.FC<CohortTrendChartProps> = ({
  data,
  title = 'Cohort Glycemic Trend (6 Months)',
  height = 260,
}) => {
  return (
    <Card className="flex flex-col gap-4">
      {title && <h3 className="text-sm font-bold text-text">{title}</h3>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f766e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="avgGlucose"
              name="Avg Glucose (mmol/L)"
              stroke="#0f766e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGlucose)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
