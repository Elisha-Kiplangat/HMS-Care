import { Controller, Delete, Get, Put, Patch, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { Roles, CurrentUser, CurrentTenant } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current logged in user profile' })
  getProfile(@CurrentUser('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN)
  @Get()
  @ApiOperation({ summary: 'List all users in tenant' })
  findAll(@CurrentTenant() tenantId: string, @CurrentUser('role') role: Role, @Query('role') requestedRole?: Role) {
    return this.usersService.findAllForTenant(role === Role.SUPER_ADMIN ? undefined : tenantId, requestedRole);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  findOne(@Param('id') id: string, @CurrentUser('id') actorId: string, @CurrentUser('role') actorRole: Role, @CurrentTenant() tenantId: string) {
    return this.usersService.findOneScoped(id, actorId, actorRole, tenantId);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update user profile or account status' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser('id') actorId: string, @CurrentUser('role') actorRole: Role, @CurrentTenant() tenantId: string) {
    return this.usersService.update(id, dto, actorId, actorRole, tenantId);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN)
  @Patch(':id/activate')
  activate(@Param('id') id: string, @CurrentUser('role') actorRole: Role, @CurrentTenant() tenantId: string) {
    return this.usersService.activate(id, actorRole, tenantId);
  }

  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  deactivate(@Param('id') id: string, @CurrentUser('role') actorRole: Role, @CurrentTenant() tenantId: string) {
    return this.usersService.deactivate(id, actorRole, tenantId);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post(':id/password-reset')
  resetPassword(@Param('id') id: string, @CurrentUser('role') actorRole: Role) {
    return this.usersService.createPasswordReset(id, actorRole);
  }
}
