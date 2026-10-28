import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { GlucoseReading } from '../../types';

export interface GlucoseChartProps {
  readings: GlucoseReading[];
}

export const GlucoseChart: React.FC<GlucoseChartProps> = ({ readings }) => {
  const data = readings.map((r) => ({
    time: new Date(r.measuredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    value: r.value,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} domain={[0, 20]} />
          <Tooltip />
          <ReferenceLine y={3.9} stroke="#dc2626" strokeDasharray="3 3" label="Low" />
          <ReferenceLine y={10.0} stroke="#d97706" strokeDasharray="3 3" label="High" />
          <Line type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
