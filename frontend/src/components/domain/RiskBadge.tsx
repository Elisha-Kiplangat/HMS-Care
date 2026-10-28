import React from 'react';
import { ArrowUp, Check, ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { RiskTier } from '../../types';

export interface RiskBadgeProps {
  tier: RiskTier | string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ tier }) => {
  const upper = tier.toUpperCase();

  if (upper === 'CRITICAL') {
    return (
      <Badge variant="danger">
        <ArrowUpRight className="w-3.5 h-3.5" /> Critical
      </Badge>
    );
  }
  if (upper === 'HIGH') {
    return (
      <Badge variant="warning">
        <ArrowUp className="w-3.5 h-3.5" /> High
      </Badge>
    );
  }
  if (upper === 'MODERATE') {
    return (
      <Badge variant="info">
        <ArrowUp className="w-3.5 h-3.5" /> Moderate
      </Badge>
    );
  }
  return (
    <Badge variant="success">
      <Check className="w-3.5 h-3.5" /> Low
    </Badge>
  );
};
