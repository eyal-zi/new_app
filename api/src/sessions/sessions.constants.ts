export const SESSION_TYPES = ['training', 'inference', 'evaluation'] as const;

export const SESSION_STATUSES = [
  'started',
  'running',
  'completed',
  'failed',
  'canceled',
] as const;

export const RECOMMENDATION_RESULT_TYPES = ['file', 'score'] as const;

/** Progress is a fraction from 0 to 1 everywhere: db, API and client. */
export const MIN_PROGRESS = 0;
export const MAX_PROGRESS = 1;
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
export const INITIAL_PROGRESS = MIN_PROGRESS;
// Placeholder base for the s8 link until the real s8 integration exists.
export const S8_TRAINING_LINK_BASE_URL = 'https://s8.example.com/training';

export const UPLOAD_FIELDS = {
  VARIATION_A: 'variationa_file',
  VARIATION_B: 'variationb_file',
} as const;

// Mock processing: until real workers exist, new sessions are completed with
// generated results after this delay.
export const MOCK_PROCESSING_DELAY_MS = 5000;
export const MOCK_RESULT_KEYS = ['_front_view', '_side_view', '_top_view'];
export const MOCK_DEFAULT_STATISTIC = 'tomato';
export const MOCK_SCORE_DECIMALS = 3;
// Every MOCK_FILE_RESULT_STEP-th statistic (the last of each group) yields
// files instead of scores.
export const MOCK_FILE_RESULT_STEP = 2;
export const MOCK_RESULT_FILE_SIZE_PX = 200;
export const MOCK_IMAGE_BASE_URL = 'https://picsum.photos/seed';
export const MOCK_EVALUATED_IMAGE_SIZE_PX = 400;
export const COMPLETED_STATUS = SESSION_STATUSES[2];
export const CANCELED_STATUS = SESSION_STATUSES[4];
export const CANCELED_LOGS = 'Session was canceled';
// Statuses a session can still be moved out of by the mock processor.
export const ACTIVE_STATUSES = ['started', 'running'] as const;

export const SESSION_FILTER_TYPES = ['string'] as const;

export type SessionFilterType = (typeof SESSION_FILTER_TYPES)[number];

export type SessionFilterDefinition = {
  /** Key inside `variationa_info` / `variationb_info`. */
  name: string;
  type: SessionFilterType;
  /** Label shown for the filter in the sessions table. */
  title: string;
};

/**
 * The extra, adjustable filters of the sessions table. They describe both the
 * properties a session's `variationa_info` / `variationb_info` may hold and
 * the properties `search_values` may filter by. Add an entry to add a filter.
 * Only `string` filters are supported for now: values are validated as strings
 * and matched as a case-insensitive substring.
 */
export const SESSION_INFO_FILTERS: readonly SessionFilterDefinition[] = [
  { name: 'banana', type: 'string', title: 'Banana' },
  { name: 'strawberry', type: 'string', title: 'Strawberry' },
];
