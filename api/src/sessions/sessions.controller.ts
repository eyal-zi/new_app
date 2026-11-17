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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtension,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { READ_ONLY_EXTENSION } from './sessions.constants.js';
import {
  DeleteSessionQueryDto,
  EvaluationSessionDto,
  GroupSessionsBodyDto,
  GroupSessionsQueryDto,
  InferenceSessionDto,
  SESSION_DETAILS_SCHEMA,
  SessionParamDto,
  SessionSearchValuesDto,
  SessionTypeParamDto,
  TrainingSessionDto,
} from './sessions.dto.js';
import { SessionsService } from './sessions.service.js';

@ApiTags('sessions')
@ApiBearerAuth()
@ApiExtraModels(InferenceSessionDto, TrainingSessionDto, EvaluationSessionDto)
@Controller()
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

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
  async deleteSession(
    @Param() { type, sessionId }: SessionParamDto,
    @Query() { should_delete }: DeleteSessionQueryDto,
  ) {
    await this.sessions.delete(type, sessionId, should_delete);
  }
}
