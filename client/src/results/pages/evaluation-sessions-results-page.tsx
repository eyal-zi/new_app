import { Stack } from '@mui/material';
import { useSearch } from '@tanstack/react-router';

import { ErrorState } from '@/shared/ui/states';

import { SESSION_IDS_PARAM } from '../consts';
import { useEvaluationResultSets } from '../hooks/use-evaluation-result-sets';
import { EvaluationResultsPage } from './evaluation-results-page';

/** Compare view: fetches every session listed in the `ids` search param. */
export const EvaluationSessionsResultsPage = () => {
  const search = useSearch({ strict: false });
  const ids = search[SESSION_IDS_PARAM] ?? [];
  const { sets, problems } = useEvaluationResultSets(ids);

  if (ids.length === 0) {
    return <ErrorState message="No sessions selected." />;
  }

  return (
    <Stack spacing={2}>
      {problems.map((problem) => (
        <ErrorState key={problem} message={problem} />
      ))}
      <EvaluationResultsPage sets={sets} />
    </Stack>
  );
};
