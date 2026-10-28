/**
 * Glucose unit conversion utilities.
 * Canonical storage in database is always in mmol/L.
 * Conversion factor: 1 mmol/L = 18.0182 mg/dL
 */

export const MMOL_TO_MGDL_FACTOR = 18.0182;

export function convertMmolToMgdl(mmolValue: number): number {
  return Math.round(mmolValue * MMOL_TO_MGDL_FACTOR);
}

export function convertMgdlToMmol(mgdlValue: number): number {
  return Number((mgdlValue / MMOL_TO_MGDL_FACTOR).toFixed(2));
}

export enum GlucoseStatusCategory {
  CRITICAL_LOW = 'CRITICAL_LOW',
  LOW = 'LOW',
  IN_RANGE = 'IN_RANGE',
  HIGH = 'HIGH',
  CRITICAL_HIGH = 'CRITICAL_HIGH',
}

export function categorizeGlucoseReading(
  mmolValue: number,
  targetMin = 3.9,
  targetMax = 10.0,
  criticalLow = 3.0,
  criticalHigh = 13.9
): GlucoseStatusCategory {
  if (mmolValue < criticalLow) return GlucoseStatusCategory.CRITICAL_LOW;
  if (mmolValue < targetMin) return GlucoseStatusCategory.LOW;
  if (mmolValue <= targetMax) return GlucoseStatusCategory.IN_RANGE;
  if (mmolValue < criticalHigh) return GlucoseStatusCategory.HIGH;
  return GlucoseStatusCategory.CRITICAL_HIGH;
}
