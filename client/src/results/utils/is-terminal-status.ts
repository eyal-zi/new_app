import type { SessionStatus } from '@/api/generated/model';
import { FINISHED_SESSION_STATUSES } from '@/sessions/consts';

/**
 * Session status flow: started -> running -> completed. From any step before
 * completed a session can also end as failed or canceled. A session that is
 * not finished is "in progress": the results pages show it as loading, offer
 * to cancel it and keep polling until it is.
 */
export const isTerminalStatus = (status: SessionStatus) =>
  FINISHED_SESSION_STATUSES.has(status);
