/**
 * Converts array of data objects to RFC 4180 compliant CSV format string.
 */
export function convertToCsv<T extends Record<string, any>>(
  data: T[],
  headers?: { key: keyof T; label: string }[]
): string {
  if (!data || data.length === 0) return '';

  const columns = headers || Object.keys(data[0]).map((k) => ({ key: k, label: k }));
  const headerRow = columns.map((col) => escapeCsvValue(col.label)).join(',');

  const bodyRows = data.map((row) =>
    columns
      .map((col) => {
        const val = row[col.key];
        return escapeCsvValue(val);
      })
      .join(',')
  );

  return [headerRow, ...bodyRows].join('\r\n');
}

function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}
