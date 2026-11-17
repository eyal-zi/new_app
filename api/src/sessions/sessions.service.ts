import { Injectable, NotFoundException } from '@nestjs/common';

import { toNaiveUtc } from '../common/naive-utc.js';
import type {
  GroupSessionsQueryDto,
  InferenceSessionDto,
  SessionDetailsDto,
  SessionDto,
  SessionSearchValuesDto,
} from './sessions.dto.js';
import { SessionsRepository } from './sessions.repository.js';
import type { sessions } from './sessions.schema.js';

type SessionRow = typeof sessions.$inferSelect;

const toSessionDto = (item: SessionRow): SessionDto => ({
  session_id: item.id,
  type: item.type as SessionDto['type'],
  session_owner: item.owner,
  image_a_url: item.imageAUrl,
  image_b_url: item.imageBUrl,
  creation_time: toNaiveUtc(item.createdAt),
  last_update: toNaiveUtc(item.updatedAt),
  progress: item.progress,
  status: item.status as SessionDto['status'],
  notes: item.notes,
  logs: item.logs,
  variationa_info: item.variationaInfo,
  variationb_info: item.variationbInfo,
});

const toSessionDetailsDto = (item: SessionRow): SessionDetailsDto => {
  const base = toSessionDto(item);

  switch (item.type) {
    case 'inference':
      return {
        ...base,
        type: 'inference',
        recommendations:
          item.recommendations as InferenceSessionDto['recommendations'],
        statistics: item.statistics ?? [],
      };
    case 'training':
      return {
        ...base,
        type: 'training',
        training_type: item.trainingType,
        s8_link: item.s8Link ?? '',
      };
    default:
      return {
        ...base,
        type: 'evaluation',
        evaluated_image_url: item.evaluatedImageUrl,
      };
  }
};

@Injectable()
export class SessionsService {
  constructor(private readonly sessions: SessionsRepository) {}

  async group(
    query: GroupSessionsQueryDto,
    searchValues?: SessionSearchValuesDto,
    type?: SessionDto['type'],
  ): Promise<SessionDetailsDto[]> {
    const items = await this.sessions.group(query, searchValues, type);
    return items.map(toSessionDetailsDto);
  }

  async get(type: SessionDto['type'], id: string): Promise<SessionDetailsDto> {
    const item = await this.sessions.findOne(type, id);

    if (!item) {
      throw new NotFoundException();
    }

    return toSessionDetailsDto(item);
  }

  count(searchValues?: SessionSearchValuesDto, type?: SessionDto['type']) {
    return this.sessions.count(searchValues, type);
  }

  async delete(type: SessionDto['type'], id: string, shouldDelete: boolean) {
    if (shouldDelete && !(await this.sessions.delete(type, id))) {
      throw new NotFoundException();
    }
  }
}
