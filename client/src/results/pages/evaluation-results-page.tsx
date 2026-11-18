import { Box, Stack, Typography } from '@mui/material';

import { ResultSet } from '../components/result-set';
import type { ResultSet as ResultSetData } from '../types';
import { ResultsContent } from './results-page.styles';

const renderSet = (set: ResultSetData) => <ResultSet key={set.id} set={set} />;

/** Presents one gallery per evaluation session: image A and its evaluated image. */
export const EvaluationResultsPage = ({
  sets,
}: {
  sets: readonly ResultSetData[];
}) => (
  <Stack spacing={3}>
    <Box>
      <Typography variant="h4">Evaluation results</Typography>
      <Typography color="text.secondary">
        Compare image A and the evaluated image for each session.
      </Typography>
    </Box>
    <ResultsContent spacing={4}>{sets.map(renderSet)}</ResultsContent>
  </Stack>
);
