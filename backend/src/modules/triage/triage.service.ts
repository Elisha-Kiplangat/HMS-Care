import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { evaluatePatientRisk } from './risk-rules.engine';
import { DEFAULT_RISK_THRESHOLDS } from './risk-rules.defaults';
import { UpdateRiskDto } from './dto/update-risk.dto';

@Injectable()
export class TriageService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateAndSaveRisk(tenantId: string, patientId: string) {
    const tenantSettings = await this.prisma.tenantSettings.findUnique({ where: { tenantId } });
    const thresholds = tenantSettings
      ? {
          critHypoThreshold: tenantSettings.critHypoThreshold,
          critHyperThreshold: tenantSettings.critHyperThreshold,
          critHba1cThreshold: tenantSettings.critHba1cThreshold,
          highHba1cMin: tenantSettings.highHba1cMin,
          modHba1cMin: tenantSettings.modHba1cMin,
        }
      : DEFAULT_RISK_THRESHOLDS;

    const glucoseReadings = await this.prisma.glucoseReading.findMany({
      where: { patientId },
      orderBy: { measuredAt: 'desc' },
      take: 30,
    });

    const hba1cResults = await this.prisma.hba1cResult.findMany({
      where: { patientId },
      orderBy: { resultDate: 'desc' },
      take: 5,
    });

    const result = evaluatePatientRisk({ glucoseReadings, hba1cResults }, thresholds);

    return this.prisma.riskAssessment.create({
      data: {
        tenantId,
        patientId,
        tier: result.tier,
        reasons: result.reasons,
      },
    });
  }

  async getCohortTriage(tenantId: string) {
    const patients = await this.prisma.patientProfile.findMany({
      where: { tenantId },
      include: {
        user: { select: { firstName: true, lastName: true } },
        riskAssessments: { orderBy: { computedAt: 'desc' }, take: 1 },
        glucoseReadings: { orderBy: { measuredAt: 'desc' }, take: 30 },
        hba1cResults: { orderBy: { resultDate: 'desc' }, take: 5 },
      },
    });

    return patients.map((p) => ({
      patientId: p.id,
      patientCode: `PT-${p.id.slice(0, 8).toUpperCase()}`,
      patientName: `${p.user.firstName} ${p.user.lastName}`,
      latestRisk: p.riskAssessments[0] || null,
      latestGlucose: p.glucoseReadings[0] || null,
      latestHba1c: p.hba1cResults[0] || null,
      glucoseReadings: p.glucoseReadings,
      hba1cResults: p.hba1cResults,
      lastReadingAt: p.glucoseReadings[0]?.measuredAt || null,
      inRangeCount: p.glucoseReadings.filter((reading) => reading.value >= 3.9 && reading.value <= 10).length,
    }));
  }

  async updateRisk(tenantId: string, patientId: string, dto: UpdateRiskDto) {
    const patient = await this.prisma.patientProfile.findFirst({ where: { id: patientId, tenantId } });
    if (!patient) throw new Error('Patient not found');
    return this.prisma.riskAssessment.create({ data: { tenantId, patientId, tier: dto.tier, reasons: dto.reasons } });
  }
}
