export type GlucoseUnit = 'mmol/L' | 'mg/dL';

export function convertGlucose(valueInMmol: number, unit: GlucoseUnit): number {
  if (unit === 'mg/dL') {
    return Math.round(valueInMmol * 18.016);
  }
  return Number(valueInMmol.toFixed(1));
}

export function getGlucoseUnitLabel(unit: GlucoseUnit): string {
  return unit;
}
