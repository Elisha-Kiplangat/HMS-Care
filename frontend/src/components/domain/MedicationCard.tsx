import React from 'react';
import { Pill, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Medication } from '../../types';

export interface MedicationCardProps {
  medication: Medication;
  onRequestRefill?: (medicationId: string) => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onRequestRefill }) => {
  return (
    <Card className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 text-primary rounded-lg">
          <Pill className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-text">{medication.name}</h4>
          <p className="text-xs text-text-muted">
            {medication.dosage} · {medication.frequency}
          </p>
        </div>
      </div>
      {onRequestRefill && (
        <Button size="sm" variant="outline" onClick={() => onRequestRefill(medication.id)}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refill
        </Button>
      )}
    </Card>
  );
};
