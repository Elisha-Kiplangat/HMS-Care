import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { RefillStatus } from '@prisma/client';

export class CreateRefillRequestDto {
  @IsString()
  @IsNotEmpty()
  medicationId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateRefillStatusDto {
  @IsEnum(RefillStatus)
  status: RefillStatus;
}
