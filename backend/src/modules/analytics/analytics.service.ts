import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCohortGlycemicSummary(tenantId: string) {
    const totalPatients = await this.prisma.patientProfile.count({ where: { tenantId } });
    const readings = await this.prisma.glucoseReading.findMany({
      where: { tenantId },
      select: { value: true },
    });

    const totalReadings = readings.length;
    const avgGlucose = totalReadings > 0
      ? readings.reduce((acc, r) => acc + r.value, 0) / totalReadings
      : 0;

    const inRangeReadings = readings.filter((r) => r.value >= 3.9 && r.value <= 10.0).length;
    const timeInRangePercentage = totalReadings > 0 ? (inRangeReadings / totalReadings) * 100 : 0;

    return {
      totalPatients,
      totalReadings,
      averageGlucoseMmol: Math.round(avgGlucose * 10) / 10,
      timeInRangePercentage: Math.round(timeInRangePercentage * 10) / 10,
    };
  }

  async getPatientLongitudinalAnalytics(patientId: string) {
    const glucoseReadings = await this.prisma.glucoseReading.findMany({
      where: { patientId },
      orderBy: { measuredAt: 'asc' },
    });

    const hba1cResults = await this.prisma.hba1cResult.findMany({
      where: { patientId },
      orderBy: { resultDate: 'asc' },
    });

    return {
      glucoseTrend: glucoseReadings.map((r) => ({ date: r.measuredAt, value: r.value, context: r.context })),
      hba1cTrend: hba1cResults.map((h) => ({ date: h.resultDate, value: h.value })),
    };
  }
}
