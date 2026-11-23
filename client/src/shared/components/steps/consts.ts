import { type CancelConfirmation, type StepsLabels } from './types';

export const DEFAULT_STEPS_LABELS: StepsLabels = {
  back: 'Back',
  cancel: 'Cancel',
  next: 'Next',
  finish: 'Finish',
  optional: 'Optional',
};

export const DISCARD_SESSION_CONFIRMATION: CancelConfirmation = {
  title: 'Discard this session?',
  description: 'The files and choices you made will be lost.',
};

export const CONNECTOR_THICKNESS_PX = 3;
