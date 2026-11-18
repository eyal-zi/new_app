import { Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { enqueueSnackbar } from 'notistack';

import { getGetSessionQueryKey, useDeleteSession } from '@/api/generated/api';
import { SessionType } from '@/api/generated/model';
import { ErrorState } from '@/shared/ui/states';

import { SESSION_CANCELED_MESSAGE, SESSION_IDS_PARAM } from '../consts';
import { useEvaluationResultSets } from '../hooks/use-evaluation-result-sets';
import { EvaluationResultsPage } from './evaluation-results-page';

/** Compare view: fetches every session listed in the `ids` search param. */
export const EvaluationSessionsResultsPage = () => {
  const search = useSearch({ strict: false });
  const ids = search[SESSION_IDS_PARAM] ?? [];
  const { sets, problems } = useEvaluationResultSets(ids);
  const queryClient = useQueryClient();
  const cancellation = useDeleteSession({
    mutation: {
      onSuccess: (_, { sessionId }) => {
        enqueueSnackbar(SESSION_CANCELED_MESSAGE, { variant: 'info' });
        // The session is now canceled, so it moves from the sets to the problems.
        void queryClient.invalidateQueries({
          queryKey: getGetSessionQueryKey(SessionType.evaluation, sessionId),
        });
      },
    },
  });

  // Not deleted: the session stays in the db, marked as canceled.
  const cancelSession = (sessionId: string) =>
    cancellation.mutate({
      type: SessionType.evaluation,
      sessionId,
      params: { should_delete: false },
    });

  if (ids.length === 0) {
    return <ErrorState message="No sessions selected." />;
  }

  return (
    <Stack spacing={2}>
      {problems.map((problem) => (
        <ErrorState key={problem} message={problem} />
      ))}
      <EvaluationResultsPage
        sets={sets}
        onCancelSet={cancelSession}
        cancelingId={
          cancellation.isPending ? cancellation.variables.sessionId : undefined
        }
      />
    </Stack>
  );
};
