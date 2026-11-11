import { Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { CompareRow } from '../components/compare-row';
import { SelectionList } from '../components/selection-list';
import { INITIAL_SELECTIONS } from '../consts';

export const SummaryPageB = () => {
  const [selections, setSelections] = useState(INITIAL_SELECTIONS);

  const removeSelection = (id: string) =>
    setSelections((current) => current.filter((item) => item.id !== id));

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Summary</Typography>
      <CompareRow />
      <SelectionList selections={selections} onRemove={removeSelection} />
    </Stack>
  );
};
