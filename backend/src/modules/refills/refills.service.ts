import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRefillRequestDto, UpdateRefillStatusDto } from './dto/refill.dto';

@Injectable()
export class RefillsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, patientId: string, dto: CreateRefillRequestDto) {
    const medication = await this.prisma.medication.findFirst({ where: { id: dto.medicationId, patientId, tenantId, isActive: true } });
    if (!medication) {
      throw new NotFoundException('Medication not found');
    }
    const existing = await this.prisma.refillRequest.findFirst({ where: { medicationId: dto.medicationId, patientId, status: { in: ['PENDING', 'APPROVED'] } } });
    if (existing) throw new NotFoundException('An active refill request already exists for this medication');

    return this.prisma.refillRequest.create({
      data: {
        tenantId,
        patientId,
        medicationId: dto.medicationId,
        notes: dto.notes,
        status: 'PENDING',
      },
      include: { medication: true },
    });
  }

  async findAllForTenant(tenantId: string, clinicianUserId?: string) {
    const requests = await this.prisma.refillRequest.findMany({
      where: { tenantId, ...(clinicianUserId ? { patient: { assignedClinician: { userId: clinicianUserId } } } : {}) },
      include: {
        medication: { include: { schedules: true } },
        patient: { include: { user: { select: { firstName: true, lastName: true, phone: true } } } },
      },
      orderBy: { requestedAt: 'desc' },
    });
    return requests.map((request) => {
      const dailyDoses = request.medication.schedules.length || 1;
      const daysSupply = request.medication.quantityDispensed > 0 ? Math.floor(request.medication.quantityDispensed / dailyDoses) : 30;
      const estimatedDueDate = new Date(request.medication.startDate.getTime() + daysSupply * 86400000);
      const daysUntilDue = Math.ceil((estimatedDueDate.getTime() - Date.now()) / 86400000);
      return { ...request, estimatedDueDate, daysUntilDue, priority: daysUntilDue <= 0 ? 'URGENT' : daysUntilDue <= 3 ? 'HIGH' : 'ROUTINE' };
    }).sort((left, right) => left.daysUntilDue - right.daysUntilDue);
  }

  async findAllForPatient(patientId: string) {
    return this.prisma.refillRequest.findMany({
      where: { patientId },
      include: { medication: true },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdateRefillStatusDto, tenantId: string) {
    const result = await this.prisma.refillRequest.updateMany({
      where: { id, tenantId },
      data: { status: dto.status, fulfilledAt: dto.status === 'FULFILLED' ? new Date() : null },
    });
    if (!result.count) throw new NotFoundException('Refill request not found');
    return this.prisma.refillRequest.findUnique({ where: { id }, include: { medication: true } });
  }
}
