import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateClinicianProfileDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(Role)
  specialty: Role;

  @IsString()
  @IsNotEmpty()
  licenceNumber: string;

  @IsString()
  @IsOptional()
  bio?: string;
}
