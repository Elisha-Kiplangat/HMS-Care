export interface RiskThresholds {
  critHypoThreshold: number;   // default 3.0 mmol/L
  critHyperThreshold: number;  // default 16.7 mmol/L
  critHba1cThreshold: number;  // default 10.0 %
  highHba1cMin: number;        // default 8.5 %
  modHba1cMin: number;         // default 7.0 %
}

export const DEFAULT_RISK_THRESHOLDS: RiskThresholds = {
  critHypoThreshold: 3.0,
  critHyperThreshold: 16.7,
  critHba1cThreshold: 10.0,
  highHba1cMin: 8.5,
  modHba1cMin: 7.0,
};
