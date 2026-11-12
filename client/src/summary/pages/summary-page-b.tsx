import { Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { CompareRow } from '../components/compare-row';
import { SelectionList } from '../components/selection-list';
import { SUMMARY_TITLE } from '../consts';
import type { CompareImage, Selection } from '../types';

export const SummaryPageB = () => {
  // TODO: get the compared images from the store.
  const imageA: CompareImage | undefined = undefined;
  const imageB: CompareImage | undefined = undefined;

  // TODO: get the initial selections from the store.
  const [selections, setSelections] = useState<Selection[]>([]);

  const removeSelection = (id: string) =>
    setSelections((current) =>
      // Never remove the last selection.
      current.length > 1 ? current.filter((item) => item.id !== id) : current,
    );

  return (
    <Stack spacing={3}>
      <Typography variant="h4">{SUMMARY_TITLE}</Typography>
      <CompareRow imageA={imageA} imageB={imageB} />
      <SelectionList selections={selections} onRemove={removeSelection} />
    </Stack>
  );
};
