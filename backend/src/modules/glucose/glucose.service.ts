import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGlucoseReadingDto, QueryGlucoseDto } from './dto/glucose.dto';

@Injectable()
export class GlucoseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, patientId: string, dto: CreateGlucoseReadingDto) {
    return this.prisma.glucoseReading.create({
      data: {
        tenantId,
        patientId,
        value: dto.value,
        context: dto.context || 'RANDOM',
        notes: dto.notes,
        source: dto.source || 'MANUAL',
        measuredAt: dto.measuredAt ? new Date(dto.measuredAt) : new Date(),
      },
    });
  }

  async findAllForPatient(patientId: string, query?: QueryGlucoseDto) {
    const where: any = { patientId };
    if (query?.startDate || query?.endDate) {
      where.measuredAt = {};
      if (query.startDate) where.measuredAt.gte = new Date(query.startDate);
      if (query.endDate) where.measuredAt.lte = new Date(query.endDate);
    }

    return this.prisma.glucoseReading.findMany({
      where,
      orderBy: { measuredAt: 'desc' },
    });
  }

  async getLatestForPatient(patientId: string) {
    return this.prisma.glucoseReading.findFirst({
      where: { patientId },
      orderBy: { measuredAt: 'desc' },
    });
  }
}
