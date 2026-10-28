import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, AcceptInvitationDto, PatientRegistrationDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getRegistrationHospitals() {
    return this.prisma.tenant.findMany({
      where: { status: 'ACTIVE' },
      select: { name: true, slug: true },
      orderBy: { name: 'asc' },
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('app.jwt.accessSecret'),
      expiresIn: this.configService.get<string>('app.jwt.accessTtl') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('app.jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('app.jwt.refreshTtl') || '7d',
    });

    const refreshTokenHash = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash,
        lastLoginAt: new Date(),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        tenantName: user.tenant?.name,
      },
    };
  }

  async refreshTokens(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get<string>('app.jwt.refreshSecret'),
      });

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Access Denied');
      }

      const isRefreshValid = await argon2.verify(user.refreshTokenHash, dto.refreshToken);
      if (!isRefreshValid) {
        throw new UnauthorizedException('Access Denied');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('app.jwt.accessSecret'),
        expiresIn: this.configService.get<string>('app.jwt.accessTtl') || '15m',
      });

      const refreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('app.jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('app.jwt.refreshTtl') || '7d',
      });

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenHash: await argon2.hash(refreshToken) },
      });

      return { accessToken, refreshToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user) {
      return { message: 'If an account exists, a reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetTokenHash,
        passwordResetExpires: expires,
      },
    });

    return { message: 'If an account exists, a reset link has been sent.', resetToken }; // Return for test/dev convenience
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: tokenHash,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await argon2.hash(dto.newPassword);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return { message: 'Password reset successfully' };
  }

  async acceptInvitation(dto: AcceptInvitationDto) {
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');
    const invitation = await this.prisma.invitation.findUnique({
      where: { tokenHash },
    });

    if (!invitation || invitation.status !== 'INVITED' || invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired invitation token');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email: invitation.email } });
    if (existingUser) {
      throw new BadRequestException('An account already exists for this email');
    }

    if (!dto.firstName || !dto.lastName) {
      throw new BadRequestException('First name and last name are required');
    }
    const firstName = dto.firstName;
    const lastName = dto.lastName;

    const passwordHash = await argon2.hash(dto.password);
    if (invitation.role === 'PATIENT' && (!dto.dateOfBirth || !dto.sex)) {
      throw new BadRequestException('Patient date of birth and sex are required');
    }
    if (['DIABETOLOGIST', 'DIABETES_NURSE_EDUCATOR', 'CLINICAL_NUTRITIONIST'].includes(invitation.role) && !dto.licenceNumber) {
      throw new BadRequestException('Clinician licence number is required');
    }

    const user = await this.prisma.$transaction(async (transaction) => {
      const consumed = await transaction.invitation.updateMany({
        where: { id: invitation.id, status: 'INVITED', expiresAt: { gt: new Date() } },
        data: { status: 'ACTIVE' },
      });
      if (consumed.count !== 1) {
        throw new BadRequestException('Invitation has already been used');
      }
      return transaction.user.create({
        data: {
          tenantId: invitation.tenantId,
          email: invitation.email,
          phone: invitation.phone,
          passwordHash,
          firstName,
          lastName,
          role: invitation.role,
          status: 'ACTIVE',
          ...(invitation.role === 'PATIENT'
            ? { patientProfile: { create: { tenantId: invitation.tenantId, dateOfBirth: new Date(dto.dateOfBirth), sex: dto.sex } } }
            : invitation.role === 'DIABETOLOGIST' || invitation.role === 'DIABETES_NURSE_EDUCATOR' || invitation.role === 'CLINICAL_NUTRITIONIST'
              ? { clinicianProfile: { create: { tenantId: invitation.tenantId, specialty: invitation.role, licenceNumber: dto.licenceNumber } } }
            : {}),
        },
      });
    });

    return { message: 'Invitation accepted successfully', userId: user.id };
  }

  async registerPatient(dto: PatientRegistrationDto) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug: dto.tenantSlug } });
    if (!tenant || tenant.status !== 'ACTIVE') {
      throw new BadRequestException('Hospital registration is unavailable');
    }
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      if (existing.status !== 'INVITED') {
        throw new BadRequestException('An account already exists for this email');
      }

      const retryAvailableAt = new Date(existing.createdAt.getTime() + 2 * 60 * 60 * 1000);
      if (retryAvailableAt > new Date()) {
        throw new BadRequestException('A registration for this email is already pending. Please try again after 2 hours if it has not been verified.');
      }

      const passwordHash = await argon2.hash(dto.password);
      const user = await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          tenantId: tenant.id,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          createdAt: new Date(),
          patientProfile: {
            update: {
              tenantId: tenant.id,
              dateOfBirth: new Date(dto.dateOfBirth),
              sex: dto.sex,
            },
          },
        },
      });
      return { message: 'Registration submitted for hospital verification', userId: user.id };
    }
    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        tenantId: tenant.id,
        email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'PATIENT',
        status: 'INVITED',
        patientProfile: {
          create: {
            tenantId: tenant.id,
            dateOfBirth: new Date(dto.dateOfBirth),
            sex: dto.sex,
          },
        },
      },
    });
    return { message: 'Registration submitted for hospital verification', userId: user.id };
  }
}
