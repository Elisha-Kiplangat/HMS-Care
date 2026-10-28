import React, { useEffect, useState } from 'react';
import { MedicationCard } from '../../../components/domain/MedicationCard';
import { medicationService } from '../../../services/medicationService';
import { refillService } from '../../../services/refillService';

export const PatientMedications: React.FC = () => {
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refillMessage, setRefillMessage] = useState<string | null>(null);
  useEffect(() => { medicationService.getMedications().then((items) => setMedications(items.map((item: any) => ({ ...item, dosage: item.dose, frequency: item.instructions || item.schedules?.map((schedule: any) => schedule.timeOfDay).join(', ') || 'As prescribed' })))).catch(() => setError('Unable to load your medications.')).finally(() => setLoading(false)); }, []);

  const requestRefill = async (medicationId: string) => {
    try {
      await refillService.requestRefill(medicationId);
      setRefillMessage('Refill request sent to your care team.');
    } catch (requestError: any) {
      setRefillMessage(requestError.response?.data?.message || 'Refill request could not be sent.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-text">My Medications</h1>
        <p className="text-xs text-text-muted mt-1">Current prescription schedule</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {refillMessage && <p className="text-sm text-primary bg-primary/5 rounded-lg p-3">{refillMessage}</p>}
      {loading && <p className="text-sm text-text-muted">Loading medications...</p>}
      {!loading && !error && medications.length === 0 && <p className="text-sm text-text-muted">No active medications are listed.</p>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {medications.map((med) => (
          <MedicationCard key={med.id} medication={med} onRequestRefill={() => void requestRefill(med.id)} />
        ))}
      </div>
    </div>
  );
};
