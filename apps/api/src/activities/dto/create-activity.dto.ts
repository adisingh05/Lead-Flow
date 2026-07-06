import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const ACTIVITY_TYPES = [
  'EMAIL_SENT',
  'EMAIL_OPENED',
  'EMAIL_CLICKED',
  'EMAIL_REPLIED',
  'CALL_MADE',
  'CALL_ANSWERED',
  'MEETING_SCHEDULED',
  'MEETING_COMPLETED',
  'NOTE_ADDED',
  'TASK_CREATED',
  'TASK_COMPLETED',
  'LINKEDIN_MESSAGE',
] as const;

export class CreateActivityDto {
  @ApiProperty({ enum: ACTIVITY_TYPES })
  @IsString()
  @IsIn(ACTIVITY_TYPES)
  type!: (typeof ACTIVITY_TYPES)[number];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  leadId?: string;
}
