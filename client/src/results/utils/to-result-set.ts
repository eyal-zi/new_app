import type { EvaluationSessionDto } from '@/api/generated/model';
import { SessionStatus } from '@/api/generated/model';

import type { ResultSet } from '../types';
import { toSessionTitle } from './to-session-title';

/**
 * One result set per evaluation session, titled by its id and sent image file name: image A next to the
 * evaluated image. Is pending until it starts, then stays loading until the session is completed and the
 * evaluated image exists.
 */
export const toResultSet = (dto: EvaluationSessionDto): ResultSet => {
  const base = {
    id: dto.session_id,
    title: toSessionTitle(dto.session_id, dto.image_a_url),
  };

  if (dto.status === SessionStatus.pending) {
    return { ...base, status: 'pending' };
  }

  if (
    dto.status !== SessionStatus.completed ||
    dto.evaluated_image_url === null
  ) {
    return { ...base, status: 'loading' };
  }

  return {
    ...base,
    status: 'ready',
    imageAUrl: dto.image_a_url,
    evaluatedImageUrl: dto.evaluated_image_url,
  };
};
