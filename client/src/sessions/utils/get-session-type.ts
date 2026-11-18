import {
  type EvaluationSessionDto,
  type InferenceSessionDto,
  SessionType,
  type TrainingSessionDto,
} from '@/api/generated/model';

export type SessionDetailsDto =
  InferenceSessionDto | TrainingSessionDto | EvaluationSessionDto;

export const isTrainingSession = (
  dto: SessionDetailsDto,
): dto is TrainingSessionDto => 's8_link' in dto;

export const isEvaluationSession = (
  dto: SessionDetailsDto,
): dto is EvaluationSessionDto => 'evaluated_image_url' in dto;

/**
 * Session details carry no `type` field, so the type is inferred from the
 * fields only one type has: a session with an `s8_link` is training, one with
 * an `evaluated_image_url` (even a null one) is evaluation, anything else is
 * inference (the `isTrainingSession` / `isEvaluationSession` guards above use
 * the same rule). If a new session type is added, teach these guards about it,
 * or it will be mistaken for inference. Where the type is already known (e.g.
 * from the URL), prefer that over inferring it.
 */
export const getSessionType = (dto: SessionDetailsDto): SessionType => {
  if (isTrainingSession(dto)) {
    return SessionType.training;
  }

  if (isEvaluationSession(dto)) {
    return SessionType.evaluation;
  }

  return SessionType.inference;
};
