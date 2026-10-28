import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePatientProfileDto, AssignClinicianDto } from './dto/patient.dto';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(tenantId: string, dto: CreatePatientProfileDto) {
    return this.prisma.patientProfile.create({
      data: {
        tenantId,
        userId: dto.userId,
        dateOfBirth: new Date(dto.dateOfBirth),
        sex: dto.sex,
        diagnosisDate: dto.diagnosisDate ? new Date(dto.diagnosisDate) : null,
        assignedClinicianId: dto.assignedClinicianId || null,
      },
      include: { user: true, assignedClinician: { include: { user: true } } },
    });
  }

  async findAllForTenant(tenantId: string) {
    return this.prisma.patientProfile.findMany({
      where: { tenantId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, status: true } },
        assignedClinician: { include: { user: { select: { firstName: true, lastName: true } } } },
        riskAssessments: { orderBy: { computedAt: 'desc' }, take: 1 },
        glucoseReadings: { orderBy: { measuredAt: 'desc' }, take: 30 },
        hba1cResults: { orderBy: { resultDate: 'desc' }, take: 5 },
      },
    }).then((patients) => patients.map((patient) => ({
      ...patient,
      patientCode: `PT-${patient.id.slice(0, 8).toUpperCase()}`,
    })));
  }

  async findOne(id: string, tenantId?: string, role?: Role, userId?: string) {
    const patient = await this.prisma.patientProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        assignedClinician: { include: { user: true } },
        glucoseReadings: { orderBy: { measuredAt: 'desc' }, take: 10 },
        hba1cResults: { orderBy: { resultDate: 'desc' }, take: 5 },
        medications: { include: { schedules: true } },
        riskAssessments: { orderBy: { computedAt: 'desc' }, take: 1 },
      },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    if (role === Role.PATIENT && patient.userId !== userId) {
      throw new ForbiddenException('Patients may only access their own medical record');
    }
    if (role !== Role.SUPER_ADMIN && tenantId && patient.tenantId !== tenantId) {
      throw new ForbiddenException('Cross-tenant patient access forbidden');
    }
    return patient;
  }

  async findByUserId(userId: string) {
    const patient = await this.prisma.patientProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        assignedClinician: { include: { user: true } },
        glucoseReadings: { orderBy: { measuredAt: 'desc' }, take: 10 },
        hba1cResults: { orderBy: { resultDate: 'desc' }, take: 5 },
        medications: { where: { isActive: true }, include: { schedules: true } },
        appointments: {
          where: { startTime: { gte: new Date() }, status: 'SCHEDULED' },
          orderBy: { startTime: 'asc' },
          take: 5,
          include: { clinician: { include: { user: { select: { firstName: true, lastName: true } } } }, callSession: true },
        },
      },
    });
    if (!patient) {
      throw new NotFoundException('Patient profile not found for user');
    }
    return patient;
  }

  async assignClinician(patientId: string, dto: AssignClinicianDto, tenantId?: string, role?: Role) {
    const patient = await this.findOne(patientId, tenantId, role);
    const clinician = await this.prisma.clinicianProfile.findUnique({
      where: { id: dto.clinicianId },
      include: { user: true },
    });
    if (!clinician || (role !== Role.SUPER_ADMIN && clinician.tenantId !== patient.tenantId)) {
      throw new NotFoundException('Clinician not found in this hospital');
    }
    if (clinician.user.status !== 'ACTIVE') {
      throw new ForbiddenException('Only active clinicians can be assigned');
    }
    return this.prisma.patientProfile.update({
      where: { id: patientId },
      data: { assignedClinicianId: dto.clinicianId },
      include: { assignedClinician: { include: { user: true } } },
    });
  }
}
