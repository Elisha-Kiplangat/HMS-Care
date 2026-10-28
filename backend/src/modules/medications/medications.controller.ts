import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/medication.dto';
import { CurrentTenant, CurrentUser, Roles } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PatientsService } from '../patients/patients.service';
import { Role } from '@prisma/client';

@ApiTags('medications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('medications')
export class MedicationsController {
  constructor(
    private readonly medicationsService: MedicationsService,
    private readonly patientsService: PatientsService,
  ) {}

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST)
  @Post('patients/:patientId')
  @ApiOperation({ summary: 'Add prescribed medication for patient' })
  createForPatient(
    @CurrentTenant() tenantId: string,
    @Param('patientId') patientId: string,
    @Body() dto: CreateMedicationDto,
  ) {
    return this.medicationsService.create(tenantId, patientId, dto);
  }

  @Get('patients/:patientId')
  @ApiOperation({ summary: 'List active medications for patient' })
  findAllForPatient(@Param('patientId') patientId: string) {
    return this.medicationsService.findAllForPatient(patientId);
  }

  @Roles(Role.PATIENT)
  @Get('me')
  @ApiOperation({ summary: 'List active medications for current patient' })
  async findAllSelf(@CurrentUser('id') userId: string) {
    const patient = await this.patientsService.findByUserId(userId);
    return this.medicationsService.findAllForPatient(patient.id);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST)
  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a medication' })
  deactivate(@Param('id') id: string) {
    return this.medicationsService.deactivate(id);
  }
}
