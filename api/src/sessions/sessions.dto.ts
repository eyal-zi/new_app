import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
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
  MAX_OWNER_LENGTH,
  MAX_SEARCH_LENGTH,
  MAX_STATISTIC_LENGTH,
  MAX_STATISTICS,
  MAX_TRAINING_TYPE_LENGTH,
  RECOMMENDATION_RESULT_TYPES,
  SESSION_STATUSES,
  SESSION_TYPES,
} from './sessions.constants.js';

export class SessionDto {
  @ApiProperty() session_id!: string;

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

export class RecommendationResultDto {
  @ApiProperty({ type: String, nullable: true })
  variationa!: string | number | null;

  @ApiProperty({ type: String, nullable: true })
  variationb!: string | number | null;

  @ApiProperty({ enum: RECOMMENDATION_RESULT_TYPES })
  type!: (typeof RECOMMENDATION_RESULT_TYPES)[number];
}

@ApiExtraModels(RecommendationResultDto)
export class RecommendationsDto {
  @ApiProperty() session_id!: string;

  @ApiProperty() statistic!: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: { $ref: getSchemaPath(RecommendationResultDto) },
    description:
      'Results keyed by column. Keys are formatted like "_this_is_key"; the client turns them into display names.',
    example: {
      _front_view: { variationa: '0.2', variationb: '0.7', type: 'score' },
    },
  })
  results!: Record<string, RecommendationResultDto>;

  @ApiProperty({ enum: SESSION_STATUSES, enumName: 'SessionStatus' })
  status!: (typeof SESSION_STATUSES)[number];
}

export class InferenceSessionDto extends SessionDto {
  @ApiProperty({
    type: [RecommendationsDto],
    description: 'One recommendation per requested statistic.',
  })
  recommendations!: RecommendationsDto[];

  @ApiProperty({ type: [String] }) statistics!: string[];
}

export class TrainingSessionDto extends SessionDto {
  @ApiProperty({ type: String, nullable: true })
  training_type!: string | null;

  @ApiProperty() s8_link!: string;
}

export class EvaluationSessionDto extends SessionDto {
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
  @ApiProperty({
    description:
      'When true the session is deleted; otherwise it is canceled (status set to failed)',
  })
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

const toArray = ({ value }: { value: unknown }) =>
  value === undefined || value === '' ? [] : [value].flat();

export class CreateSessionBodyDto {
  @ApiProperty({ maxLength: MAX_OWNER_LENGTH })
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_OWNER_LENGTH)
  session_owner!: string;
}

export class CreateInferenceSessionBodyDto extends CreateSessionBodyDto {
  @ApiProperty({ type: [String], maxLength: MAX_STATISTIC_LENGTH })
  @Transform(toArray)
  @IsArray()
  @ArrayMaxSize(MAX_STATISTICS)
  @IsString({ each: true })
  @MaxLength(MAX_STATISTIC_LENGTH, { each: true })
  statistics!: string[];
}

export class CreateTrainingSessionBodyDto extends CreateSessionBodyDto {
  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
    maxLength: MAX_TRAINING_TYPE_LENGTH,
  })
  @Transform(({ value }: { value: unknown }) =>
    value === '' || value === 'null' ? null : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(MAX_TRAINING_TYPE_LENGTH)
  training_type?: string | null;
}

export class CreateEvaluationSessionBodyDto extends CreateSessionBodyDto {}

const imageFile = (description: string) => ({
  type: 'string' as const,
  format: 'binary',
  description,
});

// Documents the multipart form for Swagger/Orval. The files themselves never
// reach the validated body: they are read from the upload interceptor.
export class CreateInferenceSessionFormDto extends CreateInferenceSessionBodyDto {
  @ApiProperty(imageFile('Image file'))
  variationa_file!: unknown;

  @ApiProperty(imageFile('Image file'))
  variationb_file!: unknown;
}

export class CreateTrainingSessionFormDto extends CreateTrainingSessionBodyDto {
  @ApiProperty(imageFile('Image file, jpg/jpeg only'))
  variationa_file!: unknown;

  @ApiProperty(imageFile('Image file'))
  variationb_file!: unknown;
}

export class CreateEvaluationSessionFormDto extends CreateEvaluationSessionBodyDto {
  @ApiProperty(imageFile('Image file, jpg/jpeg/png only'))
  variationa_file!: unknown;
}

export class CreatedSessionDto {
  @ApiProperty() session_id!: string;

  @ApiProperty({ enum: SESSION_STATUSES, enumName: 'SessionStatus' })
  status!: (typeof SESSION_STATUSES)[number];

  @ApiProperty({ type: String, nullable: true }) logs!: string | null;
}

export class CreatedTrainingSessionDto extends CreatedSessionDto {
  @ApiProperty({ type: Number, format: 'float', minimum: 0, maximum: 1 })
  progress!: number;

  @ApiProperty() s8_link!: string;
}
