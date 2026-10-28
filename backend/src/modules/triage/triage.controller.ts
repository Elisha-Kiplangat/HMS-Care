import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TriageService } from './triage.service';
import { CurrentTenant, Roles } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { UpdateRiskDto } from './dto/update-risk.dto';

@ApiTags('triage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('triage')
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST)
  @Get('cohort')
  @ApiOperation({ summary: 'Get risk-stratified cohort triage list' })
  getCohort(@CurrentTenant() tenantId: string) {
    return this.triageService.getCohortTriage(tenantId);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR)
  @Post('patients/:patientId/recalculate')
  @ApiOperation({ summary: 'Trigger risk assessment recalculation for a patient' })
  recalculate(@CurrentTenant() tenantId: string, @Param('patientId') patientId: string) {
    return this.triageService.calculateAndSaveRisk(tenantId, patientId);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST)
  @Put('patients/:patientId/risk')
  @ApiOperation({ summary: 'Update a patient risk tier and trigger reasons' })
  updateRisk(@CurrentTenant() tenantId: string, @Param('patientId') patientId: string, @Body() dto: UpdateRiskDto) {
    return this.triageService.updateRisk(tenantId, patientId, dto);
  }
}
