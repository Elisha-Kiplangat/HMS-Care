import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateHba1cResultDto {
  @IsNumber()
  value: number; // e.g. 7.5 (%)

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  resultDate?: string;
}
