import { randomUUID } from 'node:crypto';

import { Injectable, NotFoundException } from '@nestjs/common';

import { toNaiveUtc } from '../common/naive-utc.js';
import { IMAGE_TYPES } from '../files/files.constants.js';
import { FilesService, type UploadedImage } from '../files/files.service.js';
import {
  INITIAL_PROGRESS,
  PERCENT,
  S8_TRAINING_LINK_BASE_URL,
  UPLOAD_FIELDS,
} from './sessions.constants.js';
import type {
  CreatedSessionDto,
  CreatedTrainingSessionDto,
  CreateEvaluationSessionBodyDto,
  CreateInferenceSessionBodyDto,
  CreateTrainingSessionBodyDto,
  GroupSessionsQueryDto,
  InferenceSessionDto,
  SessionDetailsDto,
  SessionDto,
  SessionSearchValuesDto,
} from './sessions.dto.js';
import { SessionsRepository } from './sessions.repository.js';
import type { sessions } from './sessions.schema.js';

type SessionRow = typeof sessions.$inferSelect;

const ANY_IMAGE = IMAGE_TYPES;
const JPEG_ONLY = ['jpeg'] as const;
const JPEG_OR_PNG = ['jpeg', 'png'] as const;

const toCreatedSessionDto = (item: SessionRow): CreatedSessionDto => ({
  session_id: item.id,
  status: item.status as CreatedSessionDto['status'],
  logs: item.logs,
});

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
  constructor(
    private readonly sessions: SessionsRepository,
    private readonly files: FilesService,
  ) {}

  // The images are already on disk by now; don't leave them orphaned if the
  // session row can't be written.
  private async createOrCleanUp(
    urls: (string | undefined)[],
    values: typeof sessions.$inferInsert,
  ) {
    try {
      return await this.sessions.create(values);
    } catch (error) {
      await this.files.deleteByUrls(urls.filter((url) => url !== undefined));
      throw error;
    }
  }

  async createInference(
    body: CreateInferenceSessionBodyDto,
    variationa: UploadedImage | undefined,
    variationb: UploadedImage | undefined,
  ): Promise<CreatedSessionDto> {
    const [imageAUrl, imageBUrl] = await this.files.saveImages([
      {
        field: UPLOAD_FIELDS.VARIATION_A,
        file: variationa,
        allowed: ANY_IMAGE,
      },
      {
        field: UPLOAD_FIELDS.VARIATION_B,
        file: variationb,
        allowed: ANY_IMAGE,
      },
    ]);
    const created = await this.createOrCleanUp([imageAUrl, imageBUrl], {
      type: 'inference',
      owner: body.session_owner,
      imageAUrl: imageAUrl as string,
      imageBUrl: imageBUrl as string,
      progress: INITIAL_PROGRESS,
      statistics: body.statistics,
    });

    return toCreatedSessionDto(created);
  }

  async createTraining(
    body: CreateTrainingSessionBodyDto,
    variationa: UploadedImage | undefined,
    variationb: UploadedImage | undefined,
  ): Promise<CreatedTrainingSessionDto> {
    const [imageAUrl, imageBUrl] = await this.files.saveImages([
      {
        field: UPLOAD_FIELDS.VARIATION_A,
        file: variationa,
        allowed: JPEG_ONLY,
      },
      {
        field: UPLOAD_FIELDS.VARIATION_B,
        file: variationb,
        allowed: ANY_IMAGE,
      },
    ]);
    const id = randomUUID();
    const created = await this.createOrCleanUp([imageAUrl, imageBUrl], {
      id,
      type: 'training',
      owner: body.session_owner,
      imageAUrl: imageAUrl as string,
      imageBUrl: imageBUrl as string,
      progress: INITIAL_PROGRESS,
      trainingType: body.training_type ?? null,
      s8Link: `${S8_TRAINING_LINK_BASE_URL}/${id}`,
    });

    return {
      ...toCreatedSessionDto(created),
      progress: (created.progress ?? INITIAL_PROGRESS) / PERCENT,
      s8_link: created.s8Link ?? '',
    };
  }

  async createEvaluation(
    body: CreateEvaluationSessionBodyDto,
    variationa: UploadedImage | undefined,
  ): Promise<CreatedSessionDto> {
    const [imageAUrl] = await this.files.saveImages([
      {
        field: UPLOAD_FIELDS.VARIATION_A,
        file: variationa,
        allowed: JPEG_OR_PNG,
      },
    ]);
    const created = await this.createOrCleanUp([imageAUrl], {
      type: 'evaluation',
      owner: body.session_owner,
      imageAUrl: imageAUrl as string,
      // Evaluation sessions have a single image; the column is not nullable.
      imageBUrl: '',
      progress: INITIAL_PROGRESS,
    });

    return toCreatedSessionDto(created);
  }

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
