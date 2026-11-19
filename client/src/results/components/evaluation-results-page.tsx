import { Box, Stack, Typography } from '@mui/material';

import {
  EVALUATION_RESULTS_SUBTITLE,
  EVALUATION_RESULTS_TITLE,
} from '../consts';
import type { ResultSet as ResultSetData } from '../types';
import { ResultSet } from './result-set';
import { ResultsContent } from './results-content';

type EvaluationResultsPageProps = {
  sets: readonly ResultSetData[];
  /** Makes running sets cancelable. */
  onCancelSet?: (id: string) => void;
  /** Ids of the sets currently being canceled. */
  cancelingIds?: ReadonlySet<string>;
};

/** Presents one gallery per evaluation session: image A and its evaluated image. */
export const EvaluationResultsPage = ({
  sets,
  onCancelSet,
  cancelingIds,
}: EvaluationResultsPageProps) => (
  <Stack spacing={3}>
    <Box>
      <Typography variant="h4">{EVALUATION_RESULTS_TITLE}</Typography>
      <Typography color="text.secondary">
        {EVALUATION_RESULTS_SUBTITLE}
      </Typography>
    </Box>
    <ResultsContent spacing={4}>
      {sets.map((set) => (
        <ResultSet
          key={set.id}
          set={set}
          onCancel={onCancelSet}
          cancelingIds={cancelingIds}
        />
      ))}
    </ResultsContent>
  </Stack>
);
