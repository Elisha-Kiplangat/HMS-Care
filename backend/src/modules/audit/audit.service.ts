import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForTenant(tenantId?: string) {
    return this.prisma.auditLog.findMany({
      where: tenantId ? { tenantId } : {},
      include: {
        actor: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
  }
}
