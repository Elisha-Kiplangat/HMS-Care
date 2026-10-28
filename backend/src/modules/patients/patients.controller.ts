import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientProfileDto, AssignClinicianDto } from './dto/patient.dto';
import { Roles, CurrentTenant, CurrentUser } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST)
  @Post()
  @ApiOperation({ summary: 'Create patient profile' })
  create(@CurrentTenant() tenantId: string, @Body() dto: CreatePatientProfileDto) {
    return this.patientsService.createProfile(tenantId, dto);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST)
  @Get()
  @ApiOperation({ summary: 'List all patient profiles for tenant' })
  findAll(@CurrentTenant() tenantId: string) {
    return this.patientsService.findAllForTenant(tenantId);
  }

  @Roles(Role.PATIENT)
  @Get('me')
  @ApiOperation({ summary: 'Get current patient profile' })
  getSelf(@CurrentUser('id') userId: string) {
    return this.patientsService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient profile details by ID' })
  findOne(@Param('id') id: string, @CurrentTenant() tenantId: string, @CurrentUser('role') role: Role, @CurrentUser('id') userId: string) {
    return this.patientsService.findOne(id, tenantId, role, userId);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST)
  @Put(':id/assign-clinician')
  @ApiOperation({ summary: 'Assign patient to a clinician' })
  assignClinician(@Param('id') id: string, @Body() dto: AssignClinicianDto, @CurrentTenant() tenantId: string, @CurrentUser('role') role: Role) {
    return this.patientsService.assignClinician(id, dto, tenantId, role);
  }
}
