import { Stack, Typography } from '@mui/material';
import { useParams } from '@tanstack/react-router';
import { useEffect } from 'react';

import { useGetSession } from '@/api/generated/api';
import { SessionStatus, SessionType } from '@/api/generated/model';
import {
  isEvaluationSession,
  isTrainingSession,
} from '@/sessions/utils/get-session-type';
import { isHttpUrl } from '@/sessions/utils/is-http-url';
import { SESSION_TYPES } from '@/shared/session-type-constants';
import { ErrorState, LoadingState } from '@/shared/ui/states';

import { toResultSet } from '../utils/to-result-set';
import { toSelectionResults } from '../utils/to-selection-results';
import { EvaluationResultsPage } from './evaluation-results-page';
import { InferenceResultsPage } from './inference-results-page';

const FAILED_STATUSES: readonly SessionStatus[] = [
  SessionStatus.failed,
  SessionStatus.canceled,
];

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
    { query: { enabled: isSessionType(type) } },
  );

  if (!isSessionType(type)) {
    return <ErrorState message={`Unknown session type "${type}".`} />;
  }

  if (isPending && !isError) {
    return <LoadingState />;
  }

  if (isError || !data) {
    return <ErrorState message="Couldn't load the session." retry={refetch} />;
  }

  if (isTrainingSession(data)) {
    return <TrainingRedirect link={data.s8_link} />;
  }

  if (FAILED_STATUSES.includes(data.status)) {
    return <ErrorState message={`This session ${data.status}.`} />;
  }

  return isEvaluationSession(data) ? (
    <EvaluationResultsPage sets={[toResultSet(data)]} />
  ) : (
    <InferenceResultsPage data={toSelectionResults(data)} />
  );
};
