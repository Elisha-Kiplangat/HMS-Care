import { describe, it, expect } from 'vitest';
import { convertGlucose } from '../utils/glucoseUnits';

describe('Glucose Utils', () => {
  it('converts mmol/L to mg/dL accurately', () => {
    expect(convertGlucose(5.0, 'mg/dL')).toBe(90);
    expect(convertGlucose(10.0, 'mg/dL')).toBe(180);
  });

  it('keeps mmol/L unchanged with 1 decimal place', () => {
    expect(convertGlucose(5.5, 'mmol/L')).toBe(5.5);
  });
});
