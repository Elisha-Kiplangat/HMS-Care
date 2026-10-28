import { Injectable } from '@nestjs/common';
import { stringify } from 'csv-stringify/sync';

@Injectable()
export class CsvExportService {
  generateCsv(data: Record<string, any>[]): string {
    if (!data || data.length === 0) return '';
    return stringify(data, { header: true });
  }
}
