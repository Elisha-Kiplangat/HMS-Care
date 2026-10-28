import React, { useEffect, useState } from 'react';
import { Hba1cTrendChart } from '../../../components/charts/Hba1cTrendChart';
import { Card } from '../../../components/ui/Card';
import { hba1cService } from '../../../services/hba1cService';

export const PatientHba1c: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { hba1cService.getResults().then(setResults).catch(() => setError('Unable to load your HbA1c results.')).finally(() => setLoading(false)); }, []);
  const latest = results[0];
  const previous = results[1];
  const change = latest && previous ? latest.value - previous.value : null;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-text">HbA1c Trend</h1>
        <p className="text-xs text-text-muted mt-1">3-month average blood glucose percentage</p>
      </div>

      {/* {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && <Card><p className="text-sm text-text-muted">Loading results...</p></Card>}
      {!loading && !error && results.length === 0 && <Card><p className="text-sm text-text-muted">No HbA1c results have been saved yet.</p></Card>} */}

      <Card className="p-4 w-full max-w-4xl">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {loading && <p className="text-sm text-text-muted">Loading results...</p>}
        {!loading && !error && results.length === 0 && <Card><p className="text-sm text-text-muted">No HbA1c results have been saved yet.</p></Card>}

        <Hba1cTrendChart results={results} />
      </Card>

      <Card className="flex flex-col gap-2 bg-primary/5 border-primary/20">
        <h4 className="text-sm font-bold text-primary">What this means</h4>
        <p className="text-xs text-text-muted">
          Your latest HbA1c is <strong>{latest ? `${latest.value}%` : '--'}</strong>{change !== null && <> ({change > 0 ? '+' : ''}{change.toFixed(1)}% from the previous result)</>}. Your care team can help you interpret this result.
        </p>
      </Card>
    </div>
  );
};
