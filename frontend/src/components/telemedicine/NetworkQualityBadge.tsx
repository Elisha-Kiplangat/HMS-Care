import React from 'react';
import { Wifi } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface NetworkQualityBadgeProps {
  quality: 'good' | 'fair' | 'poor';
}

export const NetworkQualityBadge: React.FC<NetworkQualityBadgeProps> = ({ quality }) => {
  const map = {
    good: { variant: 'success' as const, label: 'Good Connection' },
    fair: { variant: 'warning' as const, label: 'Fair Connection' },
    poor: { variant: 'danger' as const, label: 'Poor Connection (Audio Recommended)' },
  };

  const curr = map[quality];

  return (
    <Badge variant={curr.variant}>
      <Wifi className="w-3.5 h-3.5 mr-1" /> {curr.label}
    </Badge>
  );
};
