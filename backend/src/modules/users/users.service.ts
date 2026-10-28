import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForTenant(tenantId?: string, role?: Role) {
    return this.prisma.user.findMany({
      where: { ...(tenantId ? { tenantId } : {}), ...(role ? { role } : {}) },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        phone: true,
        tenantId: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        phone: true,
        tenantId: true,
        createdAt: true,
        patientProfile: true,
        clinicianProfile: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneScoped(id: string, actorId: string, actorRole: Role, actorTenantId?: string) {
    const user = await this.findOne(id);
    if (actorRole !== Role.SUPER_ADMIN && user.tenantId !== actorTenantId && id !== actorId) {
      throw new ForbiddenException('Cross-tenant user access forbidden');
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto, actorId: string, actorRole: Role, actorTenantId?: string) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('User not found');
    if (actorRole !== Role.SUPER_ADMIN && existing.tenantId !== actorTenantId) {
      throw new ForbiddenException('Cross-tenant user update forbidden');
    }
    if (actorRole !== Role.SUPER_ADMIN && id === actorId) {
      throw new ForbiddenException('Users cannot change their own account status');
    }
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        phone: true,
      },
    });
  }

  async activate(id: string, actorRole: Role, actorTenantId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (actorRole !== Role.SUPER_ADMIN && user.tenantId !== actorTenantId) {
      throw new ForbiddenException('Cross-tenant account activation forbidden');
    }
    if (user.status !== 'INVITED') {
      throw new ForbiddenException('Only pending accounts can be activated');
    }
    return this.prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' },
      select: { id: true, email: true, role: true, status: true, tenantId: true },
    });
  }

  async deactivate(id: string, actorRole: Role, actorTenantId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (actorRole !== Role.SUPER_ADMIN && user.tenantId !== actorTenantId) {
      throw new ForbiddenException('Cross-tenant account deactivation forbidden');
    }
    if (user.role !== Role.HOSPITAL_ADMIN) {
      throw new BadRequestException('Only hospital admin accounts can be removed here');
    }
    return this.prisma.user.update({
      where: { id },
      data: { status: 'DEACTIVATED', refreshTokenHash: null },
      select: { id: true, email: true, role: true, status: true, tenantId: true },
    });
  }

  async createPasswordReset(id: string, actorRole: Role) {
    if (actorRole !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admins can reset platform admin passwords');
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== Role.HOSPITAL_ADMIN) {
      throw new NotFoundException('Hospital Admin not found');
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { id },
      data: {
        passwordResetToken: crypto.createHash('sha256').update(resetToken).digest('hex'),
        passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    return { message: 'Password reset token created', resetToken, expiresIn: '1 hour' };
  }
}
