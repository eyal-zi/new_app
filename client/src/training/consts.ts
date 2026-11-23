import { type ImagePickerConfig } from '@/shared/components/image-pickers-step/image-pickers-step';
import { type StepsLabels } from '@/shared/components/steps/types';
import { DRAFT_VIEW_KEYS, JPEG_ACCEPT, PNG_ACCEPT } from '@/shared/constants';
import { createDraftScope } from '@/shared/hooks/use-draft';

export const TRAINING_STEPS = {
  upload: { id: 'upload', label: 'Upload' },
  selectType: { id: 'select-type', label: 'Select type' },
  summary: { id: 'summary', label: 'Summary' },
} as const;

export const TRAINING_STEPS_LABELS: Partial<StepsLabels> = {
  finish: 'Training',
};

export const UPLOAD_TITLE = 'Upload files';
export const UPLOAD_SUBTITLE = 'Add a JPEG and a PNG to continue.';

export const VARIATIONA_FILE_PICKER: ImagePickerConfig = {
  label: 'Variationa File',
  description: 'JPEG only',
  accept: JPEG_ACCEPT,
};

export const VARIATIONB_FILE_PICKER: ImagePickerConfig = {
  label: 'Variationb File',
  description: 'PNG only',
  accept: PNG_ACCEPT,
};

export type TrainingDraft = {
  step: number;
  variationaFile: File | null;
  variationbFile: File | null;
  requiredType: string | null;
};

/** Where this page's unfinished session is remembered while the app is open. */
export const TRAINING_DRAFT_SCOPE = createDraftScope<TrainingDraft>(
  'training-draft',
  {
    step: 0,
    variationaFile: null,
    variationbFile: null,
    requiredType: null,
  },
  DRAFT_VIEW_KEYS,
);
