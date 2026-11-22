import { Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

import {
  getGetSessionQueryKey,
  useDeleteSession,
  useGetSession,
} from '@/api/generated/api';
import { SessionType } from '@/api/generated/model';
import { SESSIONS_PATH } from '@/sessions/consts';
import {
  isEvaluationSession,
  isTrainingSession,
} from '@/sessions/utils/get-session-type';
import { isHttpUrl } from '@/sessions/utils/is-http-url';
import { SESSION_TYPES } from '@/shared/session-type-constants';
import { ErrorState, LoadingState } from '@/shared/ui/states';

import { EvaluationResultsPage } from '../components/evaluation-results-page';
import { InferenceResultsPage } from '../components/inference-results-page';
import { RunningSession } from '../components/running-session';
import {
  FAILED_STATUSES,
  getFailedSessionMessage,
  getUnknownTypeMessage,
  INVALID_RESULTS_LINK_MESSAGE,
  LOAD_SESSION_ERROR_MESSAGE,
  NO_EVALUATED_IMAGE_MESSAGE,
  NO_INFERENCE_RESULTS_MESSAGE,
  REDIRECTING_MESSAGE,
  SESSION_CANCELED_MESSAGE,
} from '../consts';
import { describeFailedStatus } from '../utils/describe-failed-status';
import { isTerminalStatus } from '../utils/is-terminal-status';
import { refetchWhileInProgress } from '../utils/refetch-while-in-progress';
import { toResultSet } from '../utils/to-result-set';
import { toSelection } from '../utils/to-selection';

const isSessionType = (value: string): value is SessionType =>
  (SESSION_TYPES as readonly string[]).includes(value);

const TrainingRedirect = ({ link }: { link: string }) => {
  const isValid = isHttpUrl(link);

  useEffect(() => {
    if (isValid) {
      window.location.replace(link);
    }
  }, [isValid, link]);

  return isValid ? (
    <Stack spacing={2} alignItems="center">
      <LoadingState />
      <Typography color="text.secondary">{REDIRECTING_MESSAGE}</Typography>
    </Stack>
  ) : (
    <ErrorState message={INVALID_RESULTS_LINK_MESSAGE} />
  );
};

/** Fetches the session from the route and renders the results page for its type. */
export const SessionResultsPage = () => {
  const { type = '', sessionId = '' } = useParams({ strict: false });
  const validType = isSessionType(type) ? type : SessionType.inference;
  const { data, isPending, isError, refetch } = useGetSession(
    validType,
    sessionId,
    {
      query: {
        enabled: isSessionType(type),
        refetchInterval: refetchWhileInProgress,
      },
    },
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cancellation = useDeleteSession({
    mutation: {
      onSuccess: () => {
        enqueueSnackbar(SESSION_CANCELED_MESSAGE, { variant: 'info' });
        void navigate({ to: SESSIONS_PATH });
      },
      // Most likely the session ended before the cancel went through.
      onError: () =>
        void queryClient.invalidateQueries({
          queryKey: getGetSessionQueryKey(validType, sessionId),
        }),
    },
  });

  if (!isSessionType(type)) {
    return <ErrorState message={getUnknownTypeMessage(type)} />;
  }

  if (isPending && !isError) {
    return <LoadingState />;
  }

  // A failed background refetch keeps its data, so it doesn't replace the page.
  if (!data) {
    return <ErrorState message={LOAD_SESSION_ERROR_MESSAGE} retry={refetch} />;
  }

  // Any non-terminal status (started or running), whatever the session type.
  if (!isTerminalStatus(data.status)) {
    return (
      <RunningSession
        progress={data.progress}
        isCanceling={cancellation.isPending}
        // Not deleted: the session stays in the db, marked as canceled.
        onCancel={() =>
          cancellation.mutate({
            type,
            sessionId,
            params: { should_delete: false },
          })
        }
      />
    );
  }

  // Before the training redirect: failed and canceled sessions have no results.
  if (FAILED_STATUSES.includes(data.status)) {
    return (
      <ErrorState
        message={getFailedSessionMessage(describeFailedStatus(data.status))}
      />
    );
  }

  if (isTrainingSession(data)) {
    return <TrainingRedirect link={data.s8_link} />;
  }

  if (isEvaluationSession(data)) {
    const set = toResultSet(data);

    return set ? (
      <EvaluationResultsPage sets={[set]} />
    ) : (
      <ErrorState message={NO_EVALUATED_IMAGE_MESSAGE} />
    );
  }

  // Sessions completed before recommendations were stored have none.
  if (data.recommendations.length === 0) {
    return <ErrorState message={NO_INFERENCE_RESULTS_MESSAGE} />;
  }

  return (
    <InferenceResultsPage selections={data.recommendations.map(toSelection)} />
  );
};
