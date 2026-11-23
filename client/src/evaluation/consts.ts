import { type StepsLabels } from '@/shared/components/steps/types';
import { createDraftScope } from '@/shared/hooks/use-draft';

export const EVALUATION_STEPS = {
  upload: { id: 'upload', label: 'Upload' },
  summary: { id: 'summary', label: 'Summary' },
} as const;

export const getPartialFailureMessage = (failed: number, total: number) =>
  `${failed} of ${total} sessions couldn't be created.`;

export const EVALUATION_STEPS_LABELS: Partial<StepsLabels> = {
  finish: 'Evaluate',
};

export type EvaluationDraft = {
  step: number;
  images: File[];
};

/** Where this page's unfinished session is remembered while the app is open. */
export const EVALUATION_DRAFT_SCOPE = createDraftScope<EvaluationDraft>(
  'evaluation-draft',
  {
    step: 0,
    images: [],
  },
);
