import {
  type EvaluationSessionDto,
  type InferenceSessionDto,
  SessionType,
  type TrainingSessionDto,
} from '@/api/generated/model';

export type SessionDetailsDto =
  InferenceSessionDto | TrainingSessionDto | EvaluationSessionDto;

/**
 * The API doesn't send a type: a session with an `s8_link` is training, one
 * with an `evaluated_image_url` (even a null one) is evaluation, anything else
 * is inference.
 */
export const getSessionType = (dto: SessionDetailsDto): SessionType => {
  if ('s8_link' in dto) {
    return SessionType.training;
  }

  if ('evaluated_image_url' in dto) {
    return SessionType.evaluation;
  }

  return SessionType.inference;
};
