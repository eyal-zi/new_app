export const EVALUATION_STEPS = {
  upload: { id: 'upload', label: 'Upload' },
  summary: { id: 'summary', label: 'Summary' },
} as const;

export const getPartialFailureMessage = (failed: number, total: number) =>
  `${failed} of ${total} sessions couldn't be created.`;
