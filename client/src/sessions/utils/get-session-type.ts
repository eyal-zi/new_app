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

export const isInferenceSession = (
  dto: SessionDetailsDto,
): dto is InferenceSessionDto =>
  !isTrainingSession(dto) && !isEvaluationSession(dto);

/**
 * The API doesn't send a type: a session with an `s8_link` is training, one
 * with an `evaluated_image_url` (even a null one) is evaluation, anything else
 * is inference.
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
