import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './dto/appointment.dto';
import { CurrentTenant, CurrentUser, Roles } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AppointmentStatus, Role } from '@prisma/client';
import { PatientsService } from '../patients/patients.service';
import { CliniciansService } from '../clinicians/clinicians.service';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService, private readonly patientsService: PatientsService, private readonly cliniciansService: CliniciansService) {}

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR)
  @Post()
  @ApiOperation({ summary: 'Schedule an appointment' })
  create(@CurrentTenant() tenantId: string, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(tenantId, dto);
  }

  @Roles(Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST)
  @Post('patients/:patientId')
  @ApiOperation({ summary: 'Schedule an appointment for a patient' })
  async createForPatient(
    @CurrentTenant() tenantId: string,
    @CurrentUser('id') userId: string,
    @Param('patientId') patientId: string,
    @Body() dto: CreateAppointmentDto,
  ) {
    const clinician = (await this.cliniciansService.findAllForTenant(tenantId)).find((item) => item.user.id === userId);
    if (!clinician) throw new Error('Clinician profile not found');
    return this.appointmentsService.create(tenantId, { ...dto, patientId, clinicianId: clinician.id });
  }

  @Roles(Role.PATIENT)
  @Post('me')
  @ApiOperation({ summary: 'Request an appointment for the current patient' })
  async createSelf(
    @CurrentTenant() tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateAppointmentDto,
  ) {
    const patient = await this.patientsService.findByUserId(userId);
    return this.appointmentsService.create(tenantId, { ...dto, patientId: patient.id }, 'REQUESTED' as AppointmentStatus);
  }

  @Get()
  @ApiOperation({ summary: 'List all appointments for tenant' })
  findAll(@CurrentTenant() tenantId: string, @CurrentUser('id') userId: string, @CurrentUser('role') role: Role) {
    const clinicianOnly = [Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST].some((clinicianRole) => clinicianRole === role);
    return this.appointmentsService.findAllForTenant(tenantId, clinicianOnly ? userId : undefined);
  }

  @Roles(Role.PATIENT)
  @Get('me')
  async findSelf(@CurrentUser('id') userId: string) {
    const patient = await this.patientsService.findByUserId(userId);
    return this.appointmentsService.findAllForPatient(patient.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment details by ID' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST)
  @Put(':id/status')
  @ApiOperation({ summary: 'Update appointment status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAppointmentStatusDto, @CurrentTenant() tenantId: string) {
    return this.appointmentsService.updateStatus(id, dto, tenantId);
  }
}
