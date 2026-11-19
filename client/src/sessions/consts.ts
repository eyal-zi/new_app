import { SessionStatus, SessionType } from '@/api/generated/model';

import type {
  ColumnFilter,
  SessionColumnId,
  SessionSearchField,
} from './types';

export const SESSIONS_PATH = '/sessions';
export const RESULTS_ROUTE_PATH =
  `${SESSIONS_PATH}/$type/$sessionId/results` as const;
/** Compare view: `?ids=a,b,c` lists the evaluation sessions to show. */
export const EVALUATION_RESULTS_ROUTE_PATH =
  `${SESSIONS_PATH}/${SessionType.evaluation}/results` as const;
export const getResultsPath = (type: SessionType, id: string) =>
  `${SESSIONS_PATH}/${type}/${id}/results`;

export const TAG_FONT_SIZE = '1rem';

export const SESSION_STATUSES = Object.values(SessionStatus);

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  started: 'Started',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  canceled: 'Canceled',
};

export const SESSION_STATUS_COLORS: Record<
  SessionStatus,
  'default' | 'info' | 'primary' | 'success' | 'error' | 'warning'
> = {
  started: 'info',
  running: 'primary',
  completed: 'success',
  failed: 'error',
  canceled: 'warning',
};

export const SEARCH_FIELDS = [
  'session_id',
  'session_owner',
] as const satisfies readonly SessionSearchField[];

export const SESSION_COLUMNS = [
  { id: 'id', label: 'ID' },
  { id: 'type', label: 'Type' },
  { id: 'owner', label: 'Owner' },
  { id: 'imageA', label: 'Image A' },
  { id: 'imageB', label: 'Image B' },
  { id: 'createdAt', label: 'Created' },
  { id: 'updatedAt', label: 'Last update' },
  { id: 'progress', label: 'Progress' },
  { id: 'status', label: 'Status' },
  { id: 'results', label: 'Results' },
  { id: 'options', label: '' },
] as const;

export const COLUMN_FILTERS: Partial<Record<SessionColumnId, ColumnFilter>> = {
  id: { kind: 'text', field: 'session_id' },
  type: { kind: 'type' },
  owner: { kind: 'text', field: 'session_owner' },
  status: { kind: 'status' },
};

/** Image names in the sessions table, shown as `{sessionId} - {name}`. */
export const SESSION_IMAGE_NAMES = {
  a: 'variationa',
  b: 'variationb',
} as const;

/** Shown in place of an image the session doesn't have. */
export const NO_IMAGE_LABEL = '—';
