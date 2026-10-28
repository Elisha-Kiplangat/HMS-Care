import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './dto/appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async expireOverdueAppointments() {
    await this.prisma.appointment.updateMany({
      where: {
        status: { in: ['REQUESTED', 'SCHEDULED'] },
        endTime: { lte: new Date() },
      },
      data: { status: 'EXPIRED' as AppointmentStatus },
    });
  }

  async create(tenantId: string, dto: CreateAppointmentDto, status: AppointmentStatus | 'REQUESTED' = 'SCHEDULED') {
    if (!dto.patientId || !dto.clinicianId) {
      throw new NotFoundException('Patient and clinician are required');
    }
    const appointment = await this.prisma.appointment.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        clinicianId: dto.clinicianId,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        mode: dto.mode || 'VIDEO',
        status: status as AppointmentStatus,
        reason: dto.reason,
      },
      include: {
        patient: { include: { user: true } },
        clinician: { include: { user: true } },
      },
    });

    if (dto.mode !== 'IN_PERSON') {
      await this.prisma.callSession.create({
        data: { appointmentId: appointment.id, modeUsed: dto.mode || 'VIDEO' },
      });
    }

    return appointment;
  }

  async findAllForTenant(tenantId: string, clinicianUserId?: string) {
    await this.expireOverdueAppointments();
    return this.prisma.appointment.findMany({
      where: {
        tenantId,
        ...(clinicianUserId ? { clinician: { userId: clinicianUserId } } : {}),
      },
      include: {
        patient: { include: { user: { select: { firstName: true, lastName: true } } } },
        clinician: { include: { user: { select: { firstName: true, lastName: true } } } },
        callSession: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findAllForPatient(patientId: string) {
    await this.expireOverdueAppointments();
    return this.prisma.appointment.findMany({
      where: { patientId },
      select: {
        id: true,
        patientId: true,
        clinicianId: true,
        startTime: true,
        endTime: true,
        mode: true,
        status: true,
        reason: true,
        clinician: { select: { user: { select: { firstName: true, lastName: true } } } },
        callSession: { select: { id: true, modeUsed: true, startedAt: true, endedAt: true } },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(id: string) {
    await this.expireOverdueAppointments();
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { include: { user: true } },
        clinician: { include: { user: true } },
        callSession: { include: { vitalsSnapshot: true } },
      },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async updateStatus(id: string, dto: UpdateAppointmentStatusDto, tenantId: string) {
    const result = await this.prisma.appointment.updateMany({ where: { id, tenantId }, data: { status: dto.status } });
    if (!result.count) throw new NotFoundException('Appointment not found');
    return this.prisma.appointment.findUnique({ where: { id } });
  }
}
