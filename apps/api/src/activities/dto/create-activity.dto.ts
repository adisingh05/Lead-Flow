import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const ACTIVITY_TYPES = [
  'LEAD_CREATED',
  'LEAD_UPDATED',
  'EMAIL',
  'CALL',
  'MEETING',
  'TASK',
  'NOTE',
  'CAMPAIGN',
  'STATUS_CHANGE',
  'CUSTOM',
] as const;

export type ActivityTypeValue = (typeof ACTIVITY_TYPES)[number];

export class CreateActivityDto {
  @ApiProperty({ enum: ACTIVITY_TYPES })
  @IsString()
  @IsIn(ACTIVITY_TYPES)
  type!: ActivityTypeValue;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  leadId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  campaignId?: string;
}
