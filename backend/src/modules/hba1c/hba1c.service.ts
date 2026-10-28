import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHba1cResultDto } from './dto/hba1c.dto';

@Injectable()
export class Hba1cService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, patientId: string, clinicianId: string | null, dto: CreateHba1cResultDto) {
    return this.prisma.hba1cResult.create({
      data: {
        tenantId,
        patientId,
        value: dto.value,
        notes: dto.notes,
        recordedById: clinicianId,
        resultDate: dto.resultDate ? new Date(dto.resultDate) : new Date(),
      },
    });
  }

  async findAllForPatient(patientId: string) {
    return this.prisma.hba1cResult.findMany({
      where: { patientId },
      orderBy: { resultDate: 'desc' },
      include: { recordedBy: { include: { user: { select: { firstName: true, lastName: true } } } } },
    });
  }
}
