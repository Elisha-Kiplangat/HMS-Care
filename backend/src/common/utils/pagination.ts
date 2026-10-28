export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export function buildPaginationMeta(total: number, page: number = 1, pageSize: number = 10) {
  return {
    total,
    page: Number(page),
    pageSize: Number(pageSize),
    totalPages: Math.ceil(total / pageSize),
  };
}

export function convertGlucoseValue(value: number, fromUnit: 'mmol/L' | 'mg/dL', toUnit: 'mmol/L' | 'mg/dL'): number {
  if (fromUnit === toUnit) return value;
  if (fromUnit === 'mmol/L' && toUnit === 'mg/dL') {
    return Math.round(value * 18.016 * 10) / 10;
  }
  if (fromUnit === 'mg/dL' && toUnit === 'mmol/L') {
    return Math.round((value / 18.016) * 10) / 10;
  }
  return value;
}
