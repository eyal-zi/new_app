import { type ImagePickerConfig } from '@/shared/components/image-pickers-step/image-pickers-step';
import { type StepsLabels } from '@/shared/components/steps/types';
import { JPEG_ACCEPT, PNG_ACCEPT } from '@/shared/constants';

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
