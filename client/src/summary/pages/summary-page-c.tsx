import { Stack, Typography } from '@mui/material';

import { CompareRow } from '../components/compare-row';
import { SelectionList } from '../components/selection-list';
import { SINGLE_SELECTION } from '../consts';

export const SummaryPageC = () => (
  <Stack spacing={3}>
    <Typography variant="h4">Summary</Typography>
    <CompareRow />
    <SelectionList selections={SINGLE_SELECTION} />
  </Stack>
);
