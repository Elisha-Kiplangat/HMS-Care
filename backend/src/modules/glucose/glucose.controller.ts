import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GlucoseService } from './glucose.service';
import { CreateGlucoseReadingDto, QueryGlucoseDto } from './dto/glucose.dto';
import { CurrentTenant, CurrentUser, Roles } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PatientsService } from '../patients/patients.service';
import { Role } from '@prisma/client';

@ApiTags('glucose')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('glucose')
export class GlucoseController {
  constructor(
    private readonly glucoseService: GlucoseService,
    private readonly patientsService: PatientsService,
  ) {}

  @Post('patients/:patientId')
  @ApiOperation({ summary: 'Log a new blood glucose reading for patient' })
  async createForPatient(
    @CurrentTenant() tenantId: string,
    @Param('patientId') patientId: string,
    @Body() dto: CreateGlucoseReadingDto,
  ) {
    return this.glucoseService.create(tenantId, patientId, dto);
  }

  @Roles(Role.PATIENT)
  @Post('me')
  @ApiOperation({ summary: 'Log a new blood glucose reading for current patient' })
  async createSelf(
    @CurrentTenant() tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateGlucoseReadingDto,
  ) {
    const patient = await this.patientsService.findByUserId(userId);
    return this.glucoseService.create(tenantId, patient.id, dto);
  }

  @Get('patients/:patientId')
  @ApiOperation({ summary: 'Get blood glucose readings for a patient' })
  findAllForPatient(@Param('patientId') patientId: string, @Query() query: QueryGlucoseDto) {
    return this.glucoseService.findAllForPatient(patientId, query);
  }

  @Roles(Role.PATIENT)
  @Get('me')
  @ApiOperation({ summary: 'Get blood glucose readings for current patient' })
  async findAllSelf(@CurrentUser('id') userId: string, @Query() query: QueryGlucoseDto) {
    const patient = await this.patientsService.findByUserId(userId);
    return this.glucoseService.findAllForPatient(patient.id, query);
  }
}
