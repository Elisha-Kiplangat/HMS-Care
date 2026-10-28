import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto, UpdateTenantDto, UpdateTenantSettingsDto } from './dto/tenant.dto';
import { Roles, CurrentTenant, CurrentUser } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Roles(Role.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new hospital tenant (Super Admin only)' })
  create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.create(dto);
  }

  @Roles(Role.SUPER_ADMIN)
  @Get()
  @ApiOperation({ summary: 'List all hospital tenants (Super Admin only)' })
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current tenant profile and settings' })
  findCurrent(@CurrentTenant() tenantId: string) {
    return this.tenantsService.findOne(tenantId);
  }

  @Roles(Role.SUPER_ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get tenant details by ID' })
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update tenant status or name' })
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.tenantsService.update(id, dto);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN)
  @Put(':id/settings')
  @ApiOperation({ summary: 'Update hospital settings and risk thresholds' })
  updateSettings(@Param('id') id: string, @Body() dto: UpdateTenantSettingsDto, @CurrentUser('role') role: Role, @CurrentTenant() currentTenantId: string) {
    return this.tenantsService.updateSettings(id, dto, role, currentTenantId);
  }
}
