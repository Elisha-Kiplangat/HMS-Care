import { ConflictException, ForbiddenException, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateInvitationDto } from './dto/invitation.dto';
import { Role } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class InvitationsService {
  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {}

  async createInvitation(currentTenantId: string | undefined, invitedByUserId: string, actorRole: Role, dto: CreateInvitationDto) {
    const targetTenantId = actorRole === Role.SUPER_ADMIN ? dto.tenantId : currentTenantId;
    if (!targetTenantId) {
      throw new BadRequestException('A target hospital is required');
    }
    const hospitalInvitationRoles = [
      Role.DIABETOLOGIST,
      Role.DIABETES_NURSE_EDUCATOR,
      Role.CLINICAL_NUTRITIONIST,
      Role.PATIENT,
    ] as Role[];
    if (actorRole === Role.HOSPITAL_ADMIN && !hospitalInvitationRoles.includes(dto.role)) {
      throw new ForbiddenException('Hospital Admins may invite clinicians and patients only');
    }
    if (actorRole === Role.SUPER_ADMIN && dto.role !== Role.HOSPITAL_ADMIN) {
      throw new ForbiddenException('Super Admins may invite Hospital Admins only');
    }
    const tenant = await this.prisma.tenant.findUnique({ where: { id: targetTenantId } });
    if (!tenant) {
      throw new BadRequestException('Target hospital not found');
    }
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const existingInvitation = await this.prisma.invitation.findFirst({
      where: { tenantId: targetTenantId, email: dto.email.toLowerCase(), status: 'INVITED', expiresAt: { gt: new Date() } },
    });
    if (existingInvitation) {
      throw new ConflictException('An active invitation already exists for this email');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 86400000 * 7); // 7 days

    const invitation = await this.prisma.invitation.create({
      data: {
        tenantId: targetTenantId,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
        tokenHash,
        expiresAt,
        invitedBy: invitedByUserId,
      },
    });

    const frontendUrl = this.configService.get<string>('app.frontendUrl') || 'http://localhost:5173';
    const invitationUrl = `${frontendUrl.replace(/\/$/, '')}/accept-invitation?token=${encodeURIComponent(token)}`;

    return { ...invitation, token, invitationUrl };
  }

  async findAllForTenant(tenantId: string) {
    return this.prisma.invitation.findMany({
      where: {
        tenantId,
        role: {
          in: [Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST],
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
