import { Box, Stack, Typography } from '@mui/material';

import { ResultSet } from '../components/result-set';
import { ResultsProgress } from '../components/results-progress';
import type { ResultsData, ResultSet as ResultSetData } from '../types';
import { ResultsContent } from './results-page.styles';

const renderSet = (set: ResultSetData) => <ResultSet key={set.id} set={set} />;

export const ResultsPage = ({ data }: { data: ResultsData }) => (
  <Stack spacing={3}>
    <Box>
      <Typography variant="h4">Results</Typography>
      <Typography color="text.secondary">
        Compare image A and image B for each result set.
      </Typography>
    </Box>
    {data.status === 'in_progress' ? (
      <ResultsProgress progress={data.progress} />
    ) : (
      <ResultsContent spacing={4}>{data.sets.map(renderSet)}</ResultsContent>
    )}
  </Stack>
);
