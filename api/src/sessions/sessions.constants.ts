export const SESSION_TYPES = ['training', 'inference', 'evaluation'] as const;

export const SESSION_STATUSES = [
  'pending',
  'in_progress',
  'running',
  'completed',
  'failed',
  'canceled',
] as const;

export const RECOMMENDATION_RESULT_TYPES = ['file', 'score'] as const;

export const MAX_PROGRESS = 100;
export const MAX_OWNER_LENGTH = 254;
export const MAX_SEARCH_LENGTH = 200;
export const DEFAULT_NUMBER_OF_SESSIONS = 10;
export const MAX_NUMBER_OF_SESSIONS = 100;

// Marks POST operations that only read data, so the client generates queries
// for them instead of mutations.
export const READ_ONLY_EXTENSION = 'x-query';

export const MAX_TRAINING_TYPE_LENGTH = 100;
export const MAX_STATISTIC_LENGTH = 100;
export const MAX_STATISTICS = 50;
export const PERCENT = 100;
export const INITIAL_PROGRESS = 0;
// Placeholder base for the s8 link until the real s8 integration exists.
export const S8_TRAINING_LINK_BASE_URL = 'https://s8.example.com/training';

export const UPLOAD_FIELDS = {
  VARIATION_A: 'variationa_file',
  VARIATION_B: 'variationb_file',
} as const;
