import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RefillsService } from './refills.service';
import { CreateRefillRequestDto, UpdateRefillStatusDto } from './dto/refill.dto';
import { CurrentTenant, CurrentUser, Roles } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PatientsService } from '../patients/patients.service';
import { Role } from '@prisma/client';

@ApiTags('refills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('refills')
export class RefillsController {
  constructor(
    private readonly refillsService: RefillsService,
    private readonly patientsService: PatientsService,
  ) {}

  @Roles(Role.PATIENT)
  @Post()
  @ApiOperation({ summary: 'Request medication refill' })
  async createSelf(
    @CurrentTenant() tenantId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateRefillRequestDto,
  ) {
    const patient = await this.patientsService.findByUserId(userId);
    return this.refillsService.create(tenantId, patient.id, dto);
  }

  @Roles(Role.PATIENT)
  @Get('me')
  async findSelf(@CurrentUser('id') userId: string) {
    const patient = await this.patientsService.findByUserId(userId);
    return this.refillsService.findAllForPatient(patient.id);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST)
  @Get()
  @ApiOperation({ summary: 'List refill requests for tenant' })
  findAll(@CurrentTenant() tenantId: string, @CurrentUser('id') userId: string, @CurrentUser('role') role: Role) {
    const clinicianOnly = [Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST].some((clinicianRole) => clinicianRole === role);
    return this.refillsService.findAllForTenant(tenantId, clinicianOnly ? userId : undefined);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN, Role.DIABETOLOGIST, Role.DIABETES_NURSE_EDUCATOR, Role.CLINICAL_NUTRITIONIST)
  @Put(':id/status')
  @ApiOperation({ summary: 'Update refill request status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateRefillStatusDto, @CurrentTenant() tenantId: string) {
    return this.refillsService.updateStatus(id, dto, tenantId);
  }
}
