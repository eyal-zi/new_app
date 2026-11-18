import type { EvaluationSessionDto } from '@/api/generated/model';
import { SessionStatus } from '@/api/generated/model';

import type { ResultSet } from '../types';
import { isTerminalStatus } from './is-terminal-status';

/**
 * One result set per evaluation session, titled by its session id: image A
 * next to the evaluated image. It is `active` until the session reaches a
 * terminal status, and `loading` if the session completed but the evaluated
 * image isn't there yet. Callers filter out failed and canceled sessions
 * before calling this.
 */
export const toResultSet = (dto: EvaluationSessionDto): ResultSet => {
  const base = {
    id: dto.session_id,
    title: dto.session_id,
  };

  if (!isTerminalStatus(dto.status)) {
    return { ...base, status: 'active' };
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
