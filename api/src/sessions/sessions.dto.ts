import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import {
  DEFAULT_NUMBER_OF_SESSIONS,
  MAX_NUMBER_OF_SESSIONS,
  MAX_SEARCH_LENGTH,
  RECOMMENDATION_RESULT_TYPES,
  SESSION_STATUSES,
  SESSION_TYPES,
} from './sessions.constants.js';

export class SessionDto {
  @ApiProperty() session_id!: string;

  @ApiProperty({ enum: SESSION_TYPES, enumName: 'SessionType' })
  type!: (typeof SESSION_TYPES)[number];

  @ApiProperty() session_owner!: string;

  @ApiProperty() image_a_url!: string;

  @ApiProperty() image_b_url!: string;

  @ApiProperty({
    description: 'Naive ISO-8601 timestamp in UTC (no timezone designator)',
    example: '2026-11-09T12:00:00.000',
  })
  creation_time!: string;

  @ApiProperty({
    description: 'Naive ISO-8601 timestamp in UTC (no timezone designator)',
    example: '2026-11-09T12:00:00.000',
  })
  last_update!: string;

  @ApiProperty({ type: Number, nullable: true, minimum: 0, maximum: 100 })
  progress!: number | null;

  @ApiProperty({ enum: SESSION_STATUSES, enumName: 'SessionStatus' })
  status!: (typeof SESSION_STATUSES)[number];

  @ApiProperty() notes!: string;

  @ApiProperty({ type: String, nullable: true }) logs!: string | null;

  @ApiProperty({ type: Object, nullable: true })
  variationa_info!: Record<string, unknown> | null;

  @ApiProperty({ type: Object, nullable: true })
  variationb_info!: Record<string, unknown> | null;
}

export class RecommendationResultsDto {
  @ApiProperty({ type: String, nullable: true })
  variationa!: string | number | null;

  @ApiProperty({ type: String, nullable: true })
  variationb!: string | number | null;

  @ApiProperty({ enum: RECOMMENDATION_RESULT_TYPES })
  type!: (typeof RECOMMENDATION_RESULT_TYPES)[number];
}

export class RecommendationsDto {
  @ApiProperty() session_id!: string;

  @ApiProperty() statistic!: string;

  @ApiProperty({ type: RecommendationResultsDto })
  results!: RecommendationResultsDto;

  @ApiProperty({ enum: SESSION_STATUSES, enumName: 'SessionStatus' })
  status!: (typeof SESSION_STATUSES)[number];
}

export class InferenceSessionDto extends SessionDto {
  @ApiProperty({ enum: ['inference'], enumName: 'InferenceSessionType' })
  declare type: 'inference';

  @ApiProperty({ type: RecommendationsDto })
  recommendations!: RecommendationsDto;

  @ApiProperty({ type: [String] }) statistics!: string[];
}

export class TrainingSessionDto extends SessionDto {
  @ApiProperty({ enum: ['training'], enumName: 'TrainingSessionType' })
  declare type: 'training';

  @ApiProperty({ type: String, nullable: true })
  training_type!: string | null;

  @ApiProperty() s8_link!: string;
}

export class EvaluationSessionDto extends SessionDto {
  @ApiProperty({ enum: ['evaluation'], enumName: 'EvaluationSessionType' })
  declare type: 'evaluation';

  @ApiProperty({ type: String, nullable: true })
  evaluated_image_url!: string | null;
}

export type SessionDetailsDto =
  InferenceSessionDto | TrainingSessionDto | EvaluationSessionDto;

export const SESSION_DETAILS_SCHEMA = {
  oneOf: [
    { $ref: getSchemaPath(InferenceSessionDto) },
    { $ref: getSchemaPath(TrainingSessionDto) },
    { $ref: getSchemaPath(EvaluationSessionDto) },
  ],
  discriminator: {
    propertyName: 'type',
    mapping: {
      inference: getSchemaPath(InferenceSessionDto),
      training: getSchemaPath(TrainingSessionDto),
      evaluation: getSchemaPath(EvaluationSessionDto),
    },
  },
};

export class SessionSearchValuesDto {
  @ApiPropertyOptional({
    description: 'Case-insensitive text to look for in the session id',
    maxLength: MAX_SEARCH_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_SEARCH_LENGTH)
  session_id?: string;

  @ApiPropertyOptional({
    description: 'Case-insensitive text to look for in the session owner',
    maxLength: MAX_SEARCH_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_SEARCH_LENGTH)
  session_owner?: string;

  @ApiPropertyOptional({
    description: 'Case-insensitive text to look for in the session status',
    maxLength: MAX_SEARCH_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_SEARCH_LENGTH)
  status?: string;
}

export class SessionTypeParamDto {
  @ApiProperty({ enum: SESSION_TYPES, enumName: 'SessionType' })
  @IsIn(SESSION_TYPES)
  type!: (typeof SESSION_TYPES)[number];
}

export class SessionParamDto {
  @ApiProperty({ enum: SESSION_TYPES, enumName: 'SessionType' })
  @IsIn(SESSION_TYPES)
  type!: (typeof SESSION_TYPES)[number];

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  sessionId!: string;
}

export class DeleteSessionQueryDto {
  @ApiProperty({ description: 'The session is deleted only when true' })
  @Transform(({ value }: { value: unknown }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  should_delete!: boolean;
}

export class GroupSessionsQueryDto {
  @ApiPropertyOptional({ minimum: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  first_session_index: number = 0;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: MAX_NUMBER_OF_SESSIONS,
    default: DEFAULT_NUMBER_OF_SESSIONS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_NUMBER_OF_SESSIONS)
  number_of_sessions: number = DEFAULT_NUMBER_OF_SESSIONS;
}

export class GroupSessionsBodyDto {
  @ApiPropertyOptional({
    type: SessionSearchValuesDto,
    description: 'Sessions must match every provided value',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SessionSearchValuesDto)
  search_values?: SessionSearchValuesDto;
}
