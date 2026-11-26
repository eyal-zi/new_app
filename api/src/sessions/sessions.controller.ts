import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtension,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';

import { MAX_UPLOAD_BYTES } from '../files/files.constants.js';
import type { UploadedImage } from '../files/files.service.js';
import { READ_ONLY_EXTENSION, UPLOAD_FIELDS } from './sessions.constants.js';
import {
  CreatedSessionDto,
  CreatedTrainingSessionDto,
  CreateEvaluationSessionBodyDto,
  CreateEvaluationSessionFormDto,
  CreateInferenceSessionBodyDto,
  CreateInferenceSessionFormDto,
  CreateTrainingSessionBodyDto,
  CreateTrainingSessionFormDto,
  DeleteSessionQueryDto,
  EvaluationSessionDto,
  GroupSessionsBodyDto,
  GroupSessionsQueryDto,
  InferenceSessionDto,
  SESSION_DETAILS_SCHEMA,
  SessionFilterSchemaDto,
  SessionParamDto,
  SessionSearchValuesDto,
  SessionTypeParamDto,
  TrainingSessionDto,
} from './sessions.dto.js';
import { SessionsService } from './sessions.service.js';

type UploadedFilesByField = Record<string, UploadedImage[] | undefined>;

const uploadInterceptor = (...fields: string[]) =>
  FileFieldsInterceptor(
    fields.map((name) => ({ name, maxCount: 1 })),
    { limits: { fileSize: MAX_UPLOAD_BYTES } },
  );

@ApiTags('sessions')
@ApiBearerAuth()
@ApiExtraModels(InferenceSessionDto, TrainingSessionDto, EvaluationSessionDto)
@Controller()
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @Post('inference')
  @UseInterceptors(
    uploadInterceptor(UPLOAD_FIELDS.VARIATION_A, UPLOAD_FIELDS.VARIATION_B),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateInferenceSessionFormDto })
  @ApiOperation({ summary: 'Create an inference session' })
  @ApiCreatedResponse({ type: CreatedSessionDto })
  @ApiBadRequestResponse()
  @ApiUnsupportedMediaTypeResponse()
  @ApiPayloadTooLargeResponse({
    description: 'An image is over the size limit',
  })
  createInferenceSession(
    @Body() body: CreateInferenceSessionBodyDto,
    @UploadedFiles() files: UploadedFilesByField,
  ) {
    return this.sessions.createInference(
      body,
      files[UPLOAD_FIELDS.VARIATION_A]?.[0],
      files[UPLOAD_FIELDS.VARIATION_B]?.[0],
    );
  }

  @Post('training')
  @UseInterceptors(
    uploadInterceptor(UPLOAD_FIELDS.VARIATION_A, UPLOAD_FIELDS.VARIATION_B),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateTrainingSessionFormDto })
  @ApiOperation({ summary: 'Create a training session' })
  @ApiCreatedResponse({ type: CreatedTrainingSessionDto })
  @ApiBadRequestResponse()
  @ApiUnsupportedMediaTypeResponse()
  @ApiPayloadTooLargeResponse({
    description: 'An image is over the size limit',
  })
  createTrainingSession(
    @Body() body: CreateTrainingSessionBodyDto,
    @UploadedFiles() files: UploadedFilesByField,
  ) {
    return this.sessions.createTraining(
      body,
      files[UPLOAD_FIELDS.VARIATION_A]?.[0],
      files[UPLOAD_FIELDS.VARIATION_B]?.[0],
    );
  }

  @Post('evaluation')
  @UseInterceptors(uploadInterceptor(UPLOAD_FIELDS.VARIATION_A))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateEvaluationSessionFormDto })
  @ApiOperation({ summary: 'Create an evaluation session' })
  @ApiCreatedResponse({ type: CreatedSessionDto })
  @ApiBadRequestResponse()
  @ApiUnsupportedMediaTypeResponse()
  @ApiPayloadTooLargeResponse({
    description: 'An image is over the size limit',
  })
  createEvaluationSession(
    @Body() body: CreateEvaluationSessionBodyDto,
    @UploadedFiles() files: UploadedFilesByField,
  ) {
    return this.sessions.createEvaluation(
      body,
      files[UPLOAD_FIELDS.VARIATION_A]?.[0],
    );
  }

  @Post('sessions/group')
  @HttpCode(HttpStatus.OK)
  @ApiExtension(READ_ONLY_EXTENSION, true)
  @ApiOperation({ summary: 'Get a group of sessions of any type' })
  @ApiOkResponse({
    schema: { type: 'array', items: SESSION_DETAILS_SCHEMA },
  })
  groupSessions(
    @Query() query: GroupSessionsQueryDto,
    @Body() { search_values }: GroupSessionsBodyDto,
  ) {
    return this.sessions.group(query, search_values);
  }

  @Post(':type/sessions/group')
  @HttpCode(HttpStatus.OK)
  @ApiExtension(READ_ONLY_EXTENSION, true)
  @ApiOperation({ summary: 'Get a group of sessions of a single type' })
  @ApiOkResponse({
    schema: { type: 'array', items: SESSION_DETAILS_SCHEMA },
  })
  groupSessionsByType(
    @Param() { type }: SessionTypeParamDto,
    @Query() query: GroupSessionsQueryDto,
    @Body() { search_values }: GroupSessionsBodyDto,
  ) {
    return this.sessions.group(query, search_values, type);
  }

  @Post('sessions/count')
  @HttpCode(HttpStatus.OK)
  @ApiExtension(READ_ONLY_EXTENSION, true)
  @ApiOperation({ summary: 'Count sessions of any type' })
  @ApiOkResponse({ schema: { type: 'integer', minimum: 0 } })
  countSessions(@Body() searchValues: SessionSearchValuesDto) {
    return this.sessions.count(searchValues);
  }

  @Post(':type/sessions/count')
  @HttpCode(HttpStatus.OK)
  @ApiExtension(READ_ONLY_EXTENSION, true)
  @ApiOperation({ summary: 'Count sessions of a single type' })
  @ApiOkResponse({ schema: { type: 'integer', minimum: 0 } })
  countSessionsByType(
    @Param() { type }: SessionTypeParamDto,
    @Body() searchValues: SessionSearchValuesDto,
  ) {
    return this.sessions.count(searchValues, type);
  }

  // Declared before `:type/:sessionId`, which would otherwise match this path.
  @Get('sessions/filter-schema')
  @ApiOperation({
    summary: 'Get the extra filters available in the sessions table',
    description:
      'Each entry is a property of variationa_info / variationb_info that search_values can filter by',
  })
  @ApiOkResponse({ type: [SessionFilterSchemaDto] })
  getFilterSchema() {
    return this.sessions.getFilterSchema();
  }

  @Get(':type/:sessionId')
  @ApiOperation({ summary: 'Get a session' })
  @ApiOkResponse({ schema: SESSION_DETAILS_SCHEMA })
  @ApiNotFoundResponse()
  getSession(@Param() { type, sessionId }: SessionParamDto) {
    return this.sessions.get(type, sessionId);
  }

  @Delete(':type/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a session' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse({
    description: 'The session can no longer be canceled (it already ended)',
  })
  async deleteSession(
    @Param() { type, sessionId }: SessionParamDto,
    @Query() { should_delete }: DeleteSessionQueryDto,
  ) {
    await this.sessions.delete(type, sessionId, should_delete);
  }
}
