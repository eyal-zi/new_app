import type { SessionStatus } from '@/api/generated/model';

import { TERMINAL_STATUSES } from '../consts';

export const isTerminalStatus = (status: SessionStatus) =>
  TERMINAL_STATUSES.includes(status);
