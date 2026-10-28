import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PseudonymizationService } from './pseudonymization.service';
import { CsvExportService } from './csv-export.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pseudoService: PseudonymizationService,
    private readonly csvService: CsvExportService,
  ) {}

  async generatePseudonymizedGlucoseExport(tenantId: string, clinicianProfileId?: string): Promise<string> {
    const readings = await this.prisma.glucoseReading.findMany({
      where: { tenantId, ...(clinicianProfileId ? { patient: { assignedClinicianId: clinicianProfileId } } : {}) },
      include: { patient: true },
      orderBy: { measuredAt: 'desc' },
    });

    const rows = readings.map((r) => ({
      pseudoPatientId: this.pseudoService.pseudonymizeId(r.patientId),
      glucoseMmol: r.value,
      context: r.context,
      measuredAt: r.measuredAt.toISOString(),
      source: r.source,
    }));

    return this.csvService.generateCsv(rows);
  }

  async generatePseudonymizedGlucoseWorkbook(tenantId: string, clinicianProfileId?: string): Promise<Buffer> {
    const readings = await this.prisma.glucoseReading.findMany({
      where: { tenantId, ...(clinicianProfileId ? { patient: { assignedClinicianId: clinicianProfileId } } : {}) },
      orderBy: { measuredAt: 'desc' },
    });
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'HMS Care';
    const sheet = workbook.addWorksheet('Glucose readings');
    sheet.columns = [
      { header: 'Pseudonymized patient ID', key: 'pseudoPatientId', width: 28 },
      { header: 'Glucose (mmol/L)', key: 'glucoseMmol', width: 20 },
      { header: 'Context', key: 'context', width: 16 },
      { header: 'Measured at', key: 'measuredAt', width: 28 },
      { header: 'Source', key: 'source', width: 16 },
    ];
    sheet.getRow(1).font = { bold: true };
    readings.forEach((reading) => sheet.addRow({
      pseudoPatientId: this.pseudoService.pseudonymizeId(reading.patientId),
      glucoseMmol: reading.value,
      context: reading.context,
      measuredAt: reading.measuredAt.toISOString(),
      source: reading.source,
    }));
    return Buffer.from(await workbook.xlsx.writeBuffer());
  }
}
