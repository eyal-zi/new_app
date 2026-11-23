import { type ImagePickerConfig } from '@/shared/components/image-pickers-step/image-pickers-step';
import { type StepsLabels } from '@/shared/components/steps/types';
import { IMAGE_ACCEPT, IMAGE_ACCEPT_DESCRIPTION } from '@/shared/constants';

export const INFERENCE_STEPS = {
  upload: { id: 'upload', label: 'Upload' },
  selectStatistics: { id: 'select-statistics', label: 'Select statistics' },
  summary: { id: 'summary', label: 'Summary' },
} as const;

export const INFERENCE_STEPS_LABELS: Partial<StepsLabels> = {
  finish: 'Inference',
};

export const UPLOAD_TITLE = 'Upload files';
export const UPLOAD_SUBTITLE = `Add two images (${IMAGE_ACCEPT_DESCRIPTION}) to continue.`;

export const VARIATIONA_FILE_PICKER: ImagePickerConfig = {
  label: 'Variationa File',
  description: IMAGE_ACCEPT_DESCRIPTION,
  accept: IMAGE_ACCEPT,
};

export const VARIATIONB_FILE_PICKER: ImagePickerConfig = {
  label: 'Variationb File',
  description: IMAGE_ACCEPT_DESCRIPTION,
  accept: IMAGE_ACCEPT,
};

/** The summary step lets statistics be removed only above this count. */
export const MIN_STATISTICS = 1;
