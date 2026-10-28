import { ForbiddenException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenantDto, UpdateTenantDto, UpdateTenantSettingsDto } from './dto/tenant.dto';
import * as crypto from 'crypto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTenantDto) {
    const existing = await this.prisma.tenant.findUnique({ where: { slug: dto.slug } });
    if (existing) {
      throw new ConflictException('Tenant slug already in use');
    }

    const token = dto.adminEmail ? crypto.randomBytes(32).toString('hex') : undefined;
    const tenant = await this.prisma.$transaction(async (transaction) => {
      const createdTenant = await transaction.tenant.create({
        data: { name: dto.name, slug: dto.slug, status: dto.status || 'ACTIVE', settings: { create: {} } },
        include: { settings: true },
      });
      if (dto.adminEmail && token) {
        await transaction.invitation.create({
          data: {
            tenantId: createdTenant.id,
            email: dto.adminEmail.toLowerCase(),
            phone: dto.adminPhone,
            firstName: dto.adminFirstName || 'Hospital',
            lastName: dto.adminLastName || 'Administrator',
            role: 'HOSPITAL_ADMIN',
            tokenHash: crypto.createHash('sha256').update(token).digest('hex'),
            expiresAt: new Date(Date.now() + 7 * 86400000),
            invitedBy: 'SYSTEM',
          },
        });
      }
      return createdTenant;
    });
    return token ? { ...tenant, adminInvitationToken: token } : tenant;
  }

  async findAll() {
    return this.prisma.tenant.findMany({
      include: {
        settings: true,
        _count: {
          select: { users: true, patients: true, clinicians: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: { settings: true },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }

  async update(id: string, dto: UpdateTenantDto) {
    await this.findOne(id);
    return this.prisma.tenant.update({
      where: { id },
      data: dto,
    });
  }

  async updateSettings(tenantId: string, dto: UpdateTenantSettingsDto, role: Role, currentTenantId?: string) {
    if (role !== Role.SUPER_ADMIN && tenantId !== currentTenantId) {
      throw new ForbiddenException('Hospital Admins may only update their own hospital settings');
    }
    return this.prisma.tenantSettings.upsert({
      where: { tenantId },
      update: dto,
      create: {
        tenantId,
        ...dto,
      },
    });
  }
}
