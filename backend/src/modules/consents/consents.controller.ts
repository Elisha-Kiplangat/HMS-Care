import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConsentsService } from './consents.service';
import { CurrentUser, Roles } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ConsentType, Role } from '@prisma/client';
import { PatientsService } from '../patients/patients.service';

@ApiTags('consents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('consents')
export class ConsentsController {
  constructor(
    private readonly consentsService: ConsentsService,
    private readonly patientsService: PatientsService,
  ) {}

  @Roles(Role.PATIENT)
  @Post()
  @ApiOperation({ summary: 'Record consent for current patient' })
  async recordConsent(
    @CurrentUser('id') userId: string,
    @Body() body: { type: ConsentType; version: string; granted: boolean },
  ) {
    const patient = await this.patientsService.findByUserId(userId);
    return this.consentsService.recordConsent(patient.id, body.type, body.version, body.granted);
  }

  @Get('patients/:patientId')
  @ApiOperation({ summary: 'Get consents for a patient' })
  getPatientConsents(@Param('patientId') patientId: string) {
    return this.consentsService.getPatientConsents(patientId);
  }
}
