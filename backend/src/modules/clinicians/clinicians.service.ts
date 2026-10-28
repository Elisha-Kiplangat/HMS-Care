import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClinicianProfileDto } from './dto/clinician.dto';

@Injectable()
export class CliniciansService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(tenantId: string, dto: CreateClinicianProfileDto) {
    return this.prisma.clinicianProfile.create({
      data: {
        tenantId,
        userId: dto.userId,
        specialty: dto.specialty,
        licenceNumber: dto.licenceNumber,
        bio: dto.bio,
      },
      include: { user: true },
    });
  }

  async findAllForTenant(tenantId: string) {
    return this.prisma.clinicianProfile.findMany({
      where: { tenantId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, status: true } },
        _count: { select: { assignedPatients: true } },
      },
    });
  }

  async findOne(id: string) {
    const clinician = await this.prisma.clinicianProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        assignedPatients: { include: { user: true } },
      },
    });
    if (!clinician) {
      throw new NotFoundException('Clinician not found');
    }
    return clinician;
  }

  async findByUserId(userId: string, tenantId: string) {
    return this.prisma.clinicianProfile.findFirst({ where: { userId, tenantId } });
  }
}
