import React, { useState } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ConsentBannerProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export const ConsentBanner: React.FC<ConsentBannerProps> = ({ onAccept, onDecline }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleAccept = () => {
    setDismissed(true);
    onAccept?.();
  };

  const handleDecline = () => {
    setDismissed(true);
    onDecline?.();
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-text space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-sm text-text">
            <span>Data Privacy & Consent</span>
            <Lock className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-text-muted leading-relaxed">
            Your glycemic health data is securely encrypted under Embu Level 5 Hospital protocol and processed for clinical triage.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        {onDecline && (
          <Button variant="ghost" size="sm" onClick={handleDecline}>
            Decline
          </Button>
        )}
        <Button size="sm" onClick={handleAccept} className="font-semibold">
          Accept & Continue
        </Button>
      </div>
    </div>
  );
};
