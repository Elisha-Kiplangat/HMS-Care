import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CurrentTenant, Roles } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST)
  @Get('summary')
  @ApiOperation({ summary: 'Get cohort-wide glycemic analytics summary' })
  getCohortSummary(@CurrentTenant() tenantId: string) {
    return this.analyticsService.getCohortGlycemicSummary(tenantId);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST)
  @Get('patients/:patientId')
  @ApiOperation({ summary: 'Get longitudinal analytics for a specific patient' })
  getPatientAnalytics(@Param('patientId') patientId: string) {
    return this.analyticsService.getPatientLongitudinalAnalytics(patientId);
  }
}
