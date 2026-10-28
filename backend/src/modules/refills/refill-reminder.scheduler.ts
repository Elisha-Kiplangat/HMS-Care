import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RefillReminderScheduler {
  constructor(private readonly prisma: PrismaService) {}

  async calculateDueRefillsForTenant(tenantId: string) {
    const medications = await this.prisma.medication.findMany({
      where: { tenantId, isActive: true },
      include: { patient: { include: { user: true } }, schedules: true },
    });

    // Simple math computation for demo/scheduler
    return medications.map((med) => {
      const dailyDoses = med.schedules.length || 1;
      const daysSupply = med.quantityDispensed > 0 ? Math.floor(med.quantityDispensed / dailyDoses) : 30;
      const dueDate = new Date(med.startDate.getTime() + daysSupply * 86400000);
      return {
        medicationId: med.id,
        medicationName: med.name,
        patientName: `${med.patient.user.firstName} ${med.patient.user.lastName}`,
        dueDate,
      };
    });
  }
}
