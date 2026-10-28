import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Hba1cResult } from '../../types';

export interface Hba1cTrendChartProps {
  results: Hba1cResult[];
}

export const Hba1cTrendChart: React.FC<Hba1cTrendChartProps> = ({ results }) => {
  const data = results.map((r) => ({
    date: new Date(r.resultDate).toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
    value: r.value,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} domain={[4, 15]} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
