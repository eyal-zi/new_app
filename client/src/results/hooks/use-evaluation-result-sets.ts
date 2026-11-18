import { useQueries } from '@tanstack/react-query';

import { getGetSessionQueryOptions } from '@/api/generated/api';
import { SessionType } from '@/api/generated/model';
import { isEvaluationSession } from '@/sessions/utils/get-session-type';

import { FAILED_STATUSES } from '../consts';
import type { ResultSet } from '../types';
import { describeFailedStatus } from '../utils/describe-failed-status';
import { refetchWhileInProgress } from '../utils/refetch-while-in-progress';
import { toResultSet } from '../utils/to-result-set';

/**
 * Result sets for the given evaluation session ids. Sessions that fail to
 * load, aren't evaluation sessions, or failed/were canceled are left out and
 * reported in `problems`.
 */
export const useEvaluationResultSets = (ids: readonly string[]) => {
  const extras = useQueries({
    queries: ids.map((id) =>
      getGetSessionQueryOptions(SessionType.evaluation, id, {
        query: { refetchInterval: refetchWhileInProgress },
      }),
    ),
  });

  const sets: ResultSet[] = [];
  const problems: string[] = [];

  extras.forEach(({ data, isError, isPending }, index) => {
    // useQueries returns its results in the order of the queries, i.e. of `ids`.
    const id = ids[index] as string;

    if (isError) {
      problems.push(`Couldn't load session ${id}.`);
    } else if (isPending) {
      sets.push({ id, title: id, status: 'loading' });
    } else if (!data || !isEvaluationSession(data)) {
      problems.push(`Session ${id} is not an evaluation session.`);
    } else if (FAILED_STATUSES.includes(data.status)) {
      problems.push(`Session ${id} ${describeFailedStatus(data.status)}.`);
    } else {
      sets.push(toResultSet(data));
    }
  });

  return { sets, problems };
};
