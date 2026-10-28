import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RecordVitalsDto } from './dto/telemedicine.dto';

@Injectable()
export class CallSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async startSession(sessionId: string) {
    const session = await this.prisma.callSession.findUnique({
      where: { id: sessionId },
      include: { appointment: true },
    });
    if (!session) throw new NotFoundException('Call session not found');
    if (new Date(session.appointment.endTime) <= new Date()) {
      await this.prisma.$executeRaw`
        UPDATE "appointments" SET "status" = 'EXPIRED', "updatedAt" = NOW()
        WHERE "id" = ${session.appointmentId} AND "status" IN ('REQUESTED', 'SCHEDULED')
      `;
      throw new ForbiddenException('This appointment has expired');
    }
    return this.prisma.callSession.update({
      where: { id: sessionId },
      data: { startedAt: new Date() },
    });
  }

  async endSession(sessionId: string, qualityStats?: any) {
    return this.prisma.callSession.update({
      where: { id: sessionId },
      data: {
        endedAt: new Date(),
        qualityStats: qualityStats || undefined,
      },
    });
  }

  async recordVitals(sessionId: string, dto: RecordVitalsDto) {
    return this.prisma.vitalsSnapshot.upsert({
      where: { callSessionId: sessionId },
      update: dto,
      create: {
        callSessionId: sessionId,
        ...dto,
      },
    });
  }
}
