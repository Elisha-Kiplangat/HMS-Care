import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RecordVitalsDto {
  @IsNumber()
  @IsOptional()
  systolicBp?: number;

  @IsNumber()
  @IsOptional()
  diastolicBp?: number;

  @IsNumber()
  @IsOptional()
  weightKg?: number;

  @IsNumber()
  @IsOptional()
  glucoseMmol?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
