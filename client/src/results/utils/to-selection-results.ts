import type { InferenceSessionDto } from '@/api/generated/model';
import { SessionStatus } from '@/api/generated/model';

import type { SelectionResultsData } from '../types';
import { toSelection } from './to-selection';

/** Progress while the session is running; one selection per recommendation once it is completed. */
export const toSelectionResults = (
  dto: InferenceSessionDto,
): SelectionResultsData =>
  dto.status === SessionStatus.completed
    ? { status: 'ready', selections: dto.recommendations.map(toSelection) }
    : { status: 'started', progress: dto.progress };
