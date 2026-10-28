import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { CurrentTenant, CurrentUser, Roles } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN)
  @Get()
  @ApiOperation({ summary: 'View audit logs for tenant' })
  getAuditLogs(@CurrentTenant() tenantId: string, @CurrentUser('role') role: Role) {
    return this.auditService.findAllForTenant(role === Role.SUPER_ADMIN ? undefined : tenantId);
  }
}
