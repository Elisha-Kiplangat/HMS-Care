import { RiskTier } from '@prisma/client';
import { RiskThresholds, DEFAULT_RISK_THRESHOLDS } from './risk-rules.defaults';

export interface EvaluationInput {
  glucoseReadings: { value: number; measuredAt: Date }[];
  hba1cResults: { value: number; resultDate: Date }[];
}

export interface EvaluationResult {
  tier: RiskTier;
  reasons: string[];
}

export function evaluatePatientRisk(
  input: EvaluationInput,
  thresholds: RiskThresholds = DEFAULT_RISK_THRESHOLDS,
): EvaluationResult {
  const reasons: string[] = [];
  let tier: RiskTier = RiskTier.LOW;

  const { glucoseReadings, hba1cResults } = input;
  const latestHba1c = hba1cResults[0];

  // 1. Critical Rules
  const hasSevereHypo = glucoseReadings.some((r) => r.value < thresholds.critHypoThreshold);
  if (hasSevereHypo) {
    reasons.push(`Glucose reading recorded below critical threshold (${thresholds.critHypoThreshold} mmol/L)`);
    tier = RiskTier.CRITICAL;
  }

  if (latestHba1c && latestHba1c.value >= thresholds.critHba1cThreshold) {
    reasons.push(`Latest HbA1c is ${latestHba1c.value}% (>= ${thresholds.critHba1cThreshold}%)`);
    tier = RiskTier.CRITICAL;
  }

  const recent24hHypers = glucoseReadings.filter(
    (r) =>
      r.value >= thresholds.critHyperThreshold &&
      r.measuredAt.getTime() > Date.now() - 86400000,
  );
  if (recent24hHypers.length >= 2) {
    reasons.push(`Multiple extreme hyper readings (>= ${thresholds.critHyperThreshold} mmol/L) within 24h`);
    tier = RiskTier.CRITICAL;
  }

  if (tier === RiskTier.CRITICAL) {
    return { tier, reasons };
  }

  // 2. High Rules
  if (latestHba1c && latestHba1c.value >= thresholds.highHba1cMin) {
    reasons.push(`Latest HbA1c is ${latestHba1c.value}% (>= ${thresholds.highHba1cMin}%)`);
    tier = RiskTier.HIGH;
  }

  const now = Date.now();
  const lastLog = glucoseReadings[0];
  if (!lastLog || now - lastLog.measuredAt.getTime() > 86400000 * 7) {
    reasons.push('No blood glucose readings logged in 7+ days');
    if (tier !== RiskTier.HIGH) tier = RiskTier.HIGH;
  }

  if (tier === RiskTier.HIGH) {
    return { tier, reasons };
  }

  // 3. Moderate Rules
  if (latestHba1c && latestHba1c.value >= thresholds.modHba1cMin) {
    reasons.push(`Latest HbA1c is ${latestHba1c.value}% (>= ${thresholds.modHba1cMin}%)`);
    tier = RiskTier.MODERATE;
  }

  if (tier === RiskTier.MODERATE) {
    return { tier, reasons };
  }

  // 4. Low Tier
  reasons.push('Glycemic metrics within target parameters');
  return { tier: RiskTier.LOW, reasons };
}
