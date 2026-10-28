import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CliniciansService } from './clinicians.service';
import { CreateClinicianProfileDto } from './dto/clinician.dto';
import { Roles, CurrentTenant } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('clinicians')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinicians')
export class CliniciansController {
  constructor(private readonly cliniciansService: CliniciansService) {}

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create clinician profile' })
  create(@CurrentTenant() tenantId: string, @Body() dto: CreateClinicianProfileDto) {
    return this.cliniciansService.createProfile(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all clinicians for tenant' })
  findAll(@CurrentTenant() tenantId: string) {
    return this.cliniciansService.findAllForTenant(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinician profile details' })
  findOne(@Param('id') id: string) {
    return this.cliniciansService.findOne(id);
  }
}
