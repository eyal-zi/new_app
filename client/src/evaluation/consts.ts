import { type StepsLabels } from '@/shared/components/steps/types';

export const EVALUATION_STEPS = {
  upload: { id: 'upload', label: 'Upload' },
  summary: { id: 'summary', label: 'Summary' },
} as const;

export const getPartialFailureMessage = (failed: number, total: number) =>
  `${failed} of ${total} sessions couldn't be created.`;

export const EVALUATION_STEPS_LABELS: Partial<StepsLabels> = {
  finish: 'Evaluate',
};

/** Where this page's unfinished session is remembered while the app is open. */
export const EVALUATION_DRAFT_SCOPE = 'evaluation-draft';

export type EvaluationDraft = {
  step: number;
  images: File[];
};

export const EMPTY_EVALUATION_DRAFT: EvaluationDraft = {
  step: 0,
  images: [],
};
