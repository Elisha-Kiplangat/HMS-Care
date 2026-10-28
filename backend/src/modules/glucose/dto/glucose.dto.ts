import { IsNumber, IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { GlucoseContext } from '@prisma/client';

export class CreateGlucoseReadingDto {
  @IsNumber()
  value: number; // In mmol/L or client unit

  @IsEnum(GlucoseContext)
  @IsOptional()
  context?: GlucoseContext;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsDateString()
  @IsOptional()
  measuredAt?: string;
}

export class QueryGlucoseDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
