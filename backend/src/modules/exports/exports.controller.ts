import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ExportsService } from './exports.service';
import { CurrentTenant, CurrentUser, Roles } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { CliniciansService } from '../clinicians/clinicians.service';

@ApiTags('exports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exports')
export class ExportsController {
  constructor(private readonly exportsService: ExportsService, private readonly cliniciansService: CliniciansService) {}

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST)
  @Get('glucose/csv')
  @ApiOperation({ summary: 'Export pseudonymized glucose dataset (CSV)' })
  async exportGlucoseCsv(@CurrentTenant() tenantId: string, @CurrentUser('role') role: Role, @CurrentUser('id') userId: string, @Query('clinicianId') clinicianId: string | undefined, @Res() res: Response) {
    const clinicianOnly = [Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST].some((clinicianRole) => clinicianRole === role);
    const ownClinician = clinicianOnly ? await this.cliniciansService.findByUserId(userId, tenantId) : null;
    const csvContent = await this.exportsService.generatePseudonymizedGlucoseExport(tenantId, ownClinician?.id || clinicianId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="glucose-export-${clinicianId || (clinicianOnly ? 'assigned' : 'all')}-${Date.now()}.csv"`);
    res.send(csvContent);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST)
  @Get('glucose/xlsx')
  @ApiOperation({ summary: 'Export pseudonymized glucose dataset (Excel)' })
  async exportGlucoseXlsx(@CurrentTenant() tenantId: string, @CurrentUser('role') role: Role, @CurrentUser('id') userId: string, @Query('clinicianId') clinicianId: string | undefined, @Res() res: Response) {
    const clinicianOnly = [Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST].some((clinicianRole) => clinicianRole === role);
    const ownClinician = clinicianOnly ? await this.cliniciansService.findByUserId(userId, tenantId) : null;
    const workbook = await this.exportsService.generatePseudonymizedGlucoseWorkbook(tenantId, ownClinician?.id || clinicianId);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="glucose-export-${clinicianId || (clinicianOnly ? 'assigned' : 'all')}-${Date.now()}.xlsx"`);
    res.send(workbook);
  }
}
