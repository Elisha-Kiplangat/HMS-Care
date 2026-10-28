import React, { useEffect, useState } from 'react';
import { glucoseService } from '../../../services/glucoseService';
import { GlucoseContext } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';

export const LogGlucose: React.FC = () => {
  const [value, setValue] = useState('');
  const [context, setContext] = useState<GlucoseContext>(GlucoseContext.FASTING);
  const [loading, setLoading] = useState(false);
  const [readings, setReadings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadReadings = async () => {
    try { setReadings(await glucoseService.getReadings()); } catch { setError('Unable to load your reading history.'); }
  };

  useEffect(() => { void loadReadings(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await glucoseService.logReading({
        value: parseFloat(value),
        context,
      });
      setValue('');
      await loadReadings();
    } catch {
      setError('Reading could not be saved. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-text">Blood glucose</h1>
        <p className="text-sm text-text-muted mt-2">Keep a record of your readings and discuss patterns with your care team.</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Card className="p-5 w-full">
        <h2 className="text-base font-bold text-text mb-3">Add a reading</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Input
            label=""
            type="number"
            step="0.1"
            placeholder="mmol/L"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />

          <Select
            label=""
            value={context}
            onChange={(e) => setContext(e.target.value as GlucoseContext)}
            options={[
              { value: GlucoseContext.FASTING, label: 'Fasting' },
              { value: GlucoseContext.BEFORE_MEAL, label: 'Before Meal' },
              { value: GlucoseContext.AFTER_MEAL, label: 'After Meal' },
              { value: GlucoseContext.BEDTIME, label: 'Bedtime' },
              { value: GlucoseContext.RANDOM, label: 'Random' },
            ]}
          />

          <Button type="submit" disabled={loading} className="sm:w-auto">
            {loading ? 'Saving...' : 'Save Reading'}
          </Button>
        </form>
        <p className="text-xs text-text-muted mt-3">Use the units shown on your meter. This prototype accepts mmol/L only.</p>
      </Card>

      <Card className="p-5 min-h-40">
        <h2 className="text-base font-bold text-text mb-5">Reading history</h2>
        {readings.length === 0 ? <p className="text-sm text-text-muted text-center py-8">No readings recorded yet.</p> : (
          <div className="divide-y divide-border">
            {readings.map((reading) => <div key={reading.id} className="flex items-center justify-between py-3 text-sm"><span className="font-semibold text-text">{reading.value} mmol/L</span><span className="text-text-muted">{reading.context.replace('_', ' ').toLowerCase()} · {new Date(reading.measuredAt).toLocaleString()}</span></div>)}
          </div>
        )}
      </Card>
    </div>
  );
};
