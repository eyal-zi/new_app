import type { InferenceSessionDto } from '@/api/generated/model';
import { SessionStatus } from '@/api/generated/model';

import type { SelectionResultsData } from '../types';
import { toSelection } from './to-selection';

/** Progress while the session is running; the recommendation once it is completed. */
export const toSelectionResults = (
  dto: InferenceSessionDto,
): SelectionResultsData =>
  dto.status === SessionStatus.completed
    ? { status: 'ready', selections: [toSelection(dto.recommendations)] }
    : { status: 'in_progress', progress: dto.progress };
