import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsArray } from 'class-validator';

export class CreateMedicationScheduleDto {
  @IsString()
  timeOfDay: string; // "08:00"

  @IsArray()
  @IsOptional()
  daysOfWeek?: number[];
}

export class CreateMedicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  dose: string;

  @IsString()
  @IsOptional()
  instructions?: string;

  @IsNumber()
  @IsOptional()
  quantityDispensed?: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsArray()
  @IsOptional()
  schedules?: CreateMedicationScheduleDto[];
}
