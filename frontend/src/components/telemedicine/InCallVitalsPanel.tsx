import React from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const InCallVitalsPanel: React.FC = () => {
  return (
    <Card className="flex flex-col gap-3">
      <h4 className="text-sm font-bold text-text">Record Vitals</h4>
      <div className="grid grid-cols-2 gap-2">
        <Input label="BP (mmHg)" placeholder="120/80" />
        <Input label="Weight (kg)" placeholder="70" />
      </div>
      <Input label="Glucose (mmol/L)" placeholder="6.5" />
      <Button size="sm">Save Vitals</Button>
    </Card>
  );
};
