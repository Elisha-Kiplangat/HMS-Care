import { IsEmail, IsNotEmpty, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateInvitationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(Role)
  role: Role;

  @IsUUID()
  @IsOptional()
  tenantId?: string;
}
