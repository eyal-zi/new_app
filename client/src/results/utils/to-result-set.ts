import type { EvaluationSessionDto } from '@/api/generated/model';
import { SessionStatus } from '@/api/generated/model';

import type { ResultSet } from '../types';

/**
 * One result set per evaluation session, titled by its id: image A next to the
 * evaluated image. Stays loading until the session is completed and the
 * evaluated image exists.
 */
export const toResultSet = (dto: EvaluationSessionDto): ResultSet => {
  const base = { id: dto.session_id, title: dto.session_id };

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
