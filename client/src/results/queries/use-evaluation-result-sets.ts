import { useQueries } from '@tanstack/react-query';

import { getGetSessionQueryOptions } from '@/api/generated/api';
import { SessionType } from '@/api/generated/model';
import { isEvaluationSession } from '@/sessions/utils/get-session-type';

import {
  FAILED_STATUSES,
  getFailedProblem,
  getLoadProblem,
  getNoEvaluatedImageProblem,
  getNotEvaluationProblem,
} from '../consts';
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

  extras.forEach(({ data, isError }, index) => {
    // useQueries returns its results in the order of the queries, i.e. of `ids`.
    const id = ids[index] as string;

    // A failed background refetch keeps its data, so only a missing one is a problem.
    if (!data && isError) {
      problems.push(getLoadProblem(id));
    } else if (!data) {
      sets.push({ id, title: id, status: 'loading' });
    } else if (!isEvaluationSession(data)) {
      problems.push(getNotEvaluationProblem(id));
    } else if (FAILED_STATUSES.includes(data.status)) {
      problems.push(getFailedProblem(id, describeFailedStatus(data.status)));
    } else {
      const set = toResultSet(data);

      if (set) {
        sets.push(set);
      } else {
        problems.push(getNoEvaluatedImageProblem(id));
      }
    }
  });

  return { sets, problems };
};
