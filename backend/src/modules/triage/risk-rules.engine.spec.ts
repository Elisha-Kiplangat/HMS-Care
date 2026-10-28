import { evaluatePatientRisk } from './risk-rules.engine';
import { RiskTier } from '@prisma/client';

describe('Risk Rules Engine', () => {
  it('should flag CRITICAL when glucose is below severe hypo threshold (< 3.0 mmol/L)', () => {
    const input = {
      glucoseReadings: [{ value: 2.8, measuredAt: new Date() }],
      hba1cResults: [{ value: 7.2, resultDate: new Date() }],
    };
    const result = evaluatePatientRisk(input);
    expect(result.tier).toBe(RiskTier.CRITICAL);
    expect(result.reasons[0]).toContain('below critical threshold');
  });

  it('should flag CRITICAL when HbA1c >= 10.0%', () => {
    const input = {
      glucoseReadings: [{ value: 6.5, measuredAt: new Date() }],
      hba1cResults: [{ value: 10.5, resultDate: new Date() }],
    };
    const result = evaluatePatientRisk(input);
    expect(result.tier).toBe(RiskTier.CRITICAL);
    expect(result.reasons[0]).toContain('Latest HbA1c is 10.5%');
  });

  it('should flag HIGH when HbA1c is between 8.5% and 9.9%', () => {
    const input = {
      glucoseReadings: [{ value: 6.5, measuredAt: new Date() }],
      hba1cResults: [{ value: 9.0, resultDate: new Date() }],
    };
    const result = evaluatePatientRisk(input);
    expect(result.tier).toBe(RiskTier.HIGH);
  });

  it('should flag LOW when glucose and HbA1c are within target range', () => {
    const input = {
      glucoseReadings: [{ value: 6.2, measuredAt: new Date() }],
      hba1cResults: [{ value: 6.8, resultDate: new Date() }],
    };
    const result = evaluatePatientRisk(input);
    expect(result.tier).toBe(RiskTier.LOW);
  });
});
