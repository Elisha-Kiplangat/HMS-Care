import { IsArray, IsEnum, IsString, ArrayNotEmpty } from 'class-validator';
import { RiskTier } from '@prisma/client';

export class UpdateRiskDto {
  @IsEnum(RiskTier)
  tier: RiskTier;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  reasons: string[];
}
