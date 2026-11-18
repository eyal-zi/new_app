import type { SessionStatus } from '@/api/generated/model';

import { ACTIVE_POLL_INTERVAL_MS } from '../consts';
import { isTerminalStatus } from './is-terminal-status';

/**
 * `refetchInterval` for session queries: keeps polling until the session
 * reaches a terminal status. Use it for every query that shows a session.
 */
export const refetchWhileInProgress = ({
  state,
}: {
  state: { data?: { status: SessionStatus } };
}) =>
  state.data && !isTerminalStatus(state.data.status)
    ? ACTIVE_POLL_INTERVAL_MS
    : false;
