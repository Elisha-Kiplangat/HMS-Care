import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Hba1cService } from './hba1c.service';
import { CreateHba1cResultDto } from './dto/hba1c.dto';
import { CurrentTenant, CurrentUser, Roles } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PatientsService } from '../patients/patients.service';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('hba1c')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hba1c')
export class Hba1cController {
  constructor(
    private readonly hba1cService: Hba1cService,
    private readonly patientsService: PatientsService,
    private readonly prisma: PrismaService,
  ) {}

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR)
  @Post('patients/:patientId')
  @ApiOperation({ summary: 'Record HbA1c result for patient' })
  async createForPatient(
    @CurrentTenant() tenantId: string,
    @Param('patientId') patientId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateHba1cResultDto,
  ) {
    const clinician = await this.prisma.clinicianProfile.findUnique({ where: { userId } });
    return this.hba1cService.create(tenantId, patientId, clinician?.id || null, dto);
  }

  @Get('patients/:patientId')
  @ApiOperation({ summary: 'List HbA1c results for patient' })
  findAllForPatient(@Param('patientId') patientId: string) {
    return this.hba1cService.findAllForPatient(patientId);
  }

  @Roles(Role.PATIENT)
  @Get('me')
  @ApiOperation({ summary: 'List HbA1c results for current patient' })
  async findAllSelf(@CurrentUser('id') userId: string) {
    const patient = await this.patientsService.findByUserId(userId);
    return this.hba1cService.findAllForPatient(patient.id);
  }
}
