import { IsDateString, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePatientProfileDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  sex: string;

  @IsDateString()
  @IsOptional()
  diagnosisDate?: string;

  @IsString()
  @IsOptional()
  assignedClinicianId?: string;
}

export class AssignClinicianDto {
  @IsString()
  @IsNotEmpty()
  clinicianId: string;
}
