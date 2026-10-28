import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMedicationDto } from './dto/medication.dto';

@Injectable()
export class MedicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, patientId: string, dto: CreateMedicationDto) {
    return this.prisma.medication.create({
      data: {
        tenantId,
        patientId,
        name: dto.name,
        dose: dto.dose,
        instructions: dto.instructions,
        quantityDispensed: dto.quantityDispensed || 0,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        schedules: {
          create: dto.schedules || [],
        },
      },
      include: { schedules: true },
    });
  }

  async findAllForPatient(patientId: string) {
    return this.prisma.medication.findMany({
      where: { patientId, isActive: true },
      include: { schedules: true },
    });
  }

  async deactivate(id: string) {
    return this.prisma.medication.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
