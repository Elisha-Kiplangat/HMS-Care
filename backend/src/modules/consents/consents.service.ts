import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConsentType } from '@prisma/client';

@Injectable()
export class ConsentsService {
  constructor(private readonly prisma: PrismaService) {}

  async recordConsent(patientId: string, type: ConsentType, version: string, granted: boolean) {
    return this.prisma.consent.create({
      data: {
        patientId,
        type,
        version,
        granted,
        grantedAt: new Date(),
        revokedAt: granted ? null : new Date(),
      },
    });
  }

  async getPatientConsents(patientId: string) {
    return this.prisma.consent.findMany({
      where: { patientId },
      orderBy: { grantedAt: 'desc' },
    });
  }
}
