import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card } from '../ui/Card';

export interface RiskDistributionPoint {
  name: string;
  value: number;
  color: string;
}

export interface RiskDistributionChartProps {
  data?: RiskDistributionPoint[];
  title?: string;
  height?: number;
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({
  data = [
    { name: 'Critical', value: 3, color: '#dc2626' },
    { name: 'High', value: 12, color: '#d97706' },
    { name: 'Moderate', value: 31, color: '#2563eb' },
    { name: 'Low', value: 104, color: '#16a34a' },
  ],
  title = 'Population Risk Tier Breakdown',
  height = 260,
}) => {
  return (
    <Card className="flex flex-col gap-4">
      {title && <h3 className="text-sm font-bold text-text">{title}</h3>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
