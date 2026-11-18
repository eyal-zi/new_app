import { Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from '@tanstack/react-router';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

import { useDeleteSession, useGetSession } from '@/api/generated/api';
import { SessionType } from '@/api/generated/model';
import { SESSIONS_PATH } from '@/sessions/consts';
import {
  isEvaluationSession,
  isTrainingSession,
} from '@/sessions/utils/get-session-type';
import { isHttpUrl } from '@/sessions/utils/is-http-url';
import { SESSION_TYPES } from '@/shared/session-type-constants';
import { ErrorState, LoadingState } from '@/shared/ui/states';

import { RunningSession } from '../components/running-session';
import { FAILED_STATUSES, SESSION_CANCELED_MESSAGE } from '../consts';
import { describeFailedStatus } from '../utils/describe-failed-status';
import { isTerminalStatus } from '../utils/is-terminal-status';
import { refetchWhileInProgress } from '../utils/refetch-while-in-progress';
import { toResultSet } from '../utils/to-result-set';
import { toSelection } from '../utils/to-selection';
import { EvaluationResultsPage } from './evaluation-results-page';
import { InferenceResultsPage } from './inference-results-page';

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
      <Typography color="text.secondary">
        Redirecting to the training results…
      </Typography>
    </Stack>
  ) : (
    <ErrorState message="This session has an invalid results link." />
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
  const cancellation = useDeleteSession({
    mutation: {
      onSuccess: () => {
        enqueueSnackbar(SESSION_CANCELED_MESSAGE, { variant: 'info' });
        void navigate({ to: SESSIONS_PATH });
      },
    },
  });

  if (!isSessionType(type)) {
    return <ErrorState message={`Unknown session type "${type}".`} />;
  }

  if (isPending && !isError) {
    return <LoadingState />;
  }

  if (isError || !data) {
    return <ErrorState message="Couldn't load the session." retry={refetch} />;
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

  if (isTrainingSession(data)) {
    return <TrainingRedirect link={data.s8_link} />;
  }

  if (FAILED_STATUSES.includes(data.status)) {
    return (
      <ErrorState
        message={`This session ${describeFailedStatus(data.status)}.`}
      />
    );
  }

  // Only completed sessions get here, so inference results are all available.
  return isEvaluationSession(data) ? (
    <EvaluationResultsPage sets={[toResultSet(data)]} />
  ) : (
    <InferenceResultsPage selections={data.recommendations.map(toSelection)} />
  );
};
