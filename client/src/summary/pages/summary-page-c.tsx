import { Stack, Typography } from '@mui/material';

import { CompareRow } from '../components/compare-row';
import { SelectionList } from '../components/selection-list';
import type { CompareImage, Selection } from '../types';

export const SummaryPageC = () => {
  // TODO: get the compared images from the store.
  const imageA: CompareImage | undefined = undefined;
  const imageB: CompareImage | undefined = undefined;

  // TODO: get the selection from the store.
  const selections: Selection[] = [];

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Summary</Typography>
      <CompareRow imageA={imageA} imageB={imageB} />
      <SelectionList selections={selections} />
    </Stack>
  );
};
