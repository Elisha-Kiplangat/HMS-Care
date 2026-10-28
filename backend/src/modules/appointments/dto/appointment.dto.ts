import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { AppointmentMode, AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @IsString()
  @IsOptional()
  patientId?: string;

  @IsString()
  @IsOptional()
  clinicianId?: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsEnum(AppointmentMode)
  @IsOptional()
  mode?: AppointmentMode;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
