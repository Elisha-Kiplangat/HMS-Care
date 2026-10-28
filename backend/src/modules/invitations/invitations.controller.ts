import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/invitation.dto';
import { Roles, CurrentTenant, CurrentUser } from '../../common/decorators/auth.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('invitations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Send invitation to a clinician, patient, or hospital admin' })
  create(
    @CurrentTenant() tenantId: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') actorRole: Role,
    @Body() dto: CreateInvitationDto,
  ) {
    return this.invitationsService.createInvitation(tenantId, userId, actorRole, dto);
  }

  @Roles(Role.SUPER_ADMIN, Role.HOSPITAL_ADMIN)
  @Get()
  @ApiOperation({ summary: 'List pending invitations for tenant' })
  findAll(@CurrentTenant() tenantId: string) {
    return this.invitationsService.findAllForTenant(tenantId);
  }
}
