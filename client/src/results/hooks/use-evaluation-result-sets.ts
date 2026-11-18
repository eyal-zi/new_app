import { useQueries } from '@tanstack/react-query';

import { getGetSessionQueryOptions } from '@/api/generated/api';
import { SessionStatus, SessionType } from '@/api/generated/model';
import { isEvaluationSession } from '@/sessions/utils/get-session-type';

import { PENDING_POLL_INTERVAL_MS } from '../consts';
import type { ResultSet } from '../types';
import { toResultSet } from '../utils/to-result-set';

const FAILED_STATUSES: readonly SessionStatus[] = [
  SessionStatus.failed,
  SessionStatus.canceled,
];

/**
 * Result sets for the given evaluation session ids. Sessions that fail to
 * load, aren't evaluation sessions, or failed/were canceled are left out and
 * reported in `problems`.
 */
export const useEvaluationResultSets = (ids: readonly string[]) => {
  const extras = useQueries({
    queries: ids.map((id) =>
      getGetSessionQueryOptions(SessionType.evaluation, id, {
        query: {
          // Keep checking until the session leaves the pending state.
          refetchInterval: ({ state }) =>
            state.data?.status === SessionStatus.pending
              ? PENDING_POLL_INTERVAL_MS
              : false,
        },
      }),
    ),
  });

  const sets: ResultSet[] = [];
  const problems: string[] = [];

  extras.forEach(({ data, isError, isPending }, index) => {
    const id = ids[index] ?? '';

    if (isError) {
      problems.push(`Couldn't load session ${id}.`);
    } else if (isPending) {
      sets.push({ id, title: id, status: 'loading' });
    } else if (!data || !isEvaluationSession(data)) {
      problems.push(`Session ${id} is not an evaluation session.`);
    } else if (FAILED_STATUSES.includes(data.status)) {
      problems.push(`Session ${id} ${data.status}.`);
    } else {
      sets.push(toResultSet(data));
    }
  });

  return { sets, problems };
};
