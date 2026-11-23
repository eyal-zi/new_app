import type { EvaluationSessionDto } from '@/api/generated/model';
import { SessionStatus } from '@/api/generated/model';

import type { ResultSet } from '../types';
import { isTerminalStatus } from './is-terminal-status';

/**
 * One result set per evaluation session, titled by its session id: variationa image
 * next to the evaluated image. It is `active` until the session reaches a
 * terminal status. Returns null if the session completed without an
 * evaluated image. Callers filter out failed and canceled sessions before
 * calling this.
 */
export const toResultSet = (dto: EvaluationSessionDto): ResultSet | null => {
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
    return null;
  }

  return {
    ...base,
    status: 'ready',
    variationaFileUrl: dto.variationa_file_url,
    evaluatedImageUrl: dto.evaluated_image_url,
  };
};
