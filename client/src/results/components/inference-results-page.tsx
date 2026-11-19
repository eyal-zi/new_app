import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { INFERENCE_RESULTS_SUBTITLE, INFERENCE_RESULTS_TITLE } from '../consts';
import { useImageSelection } from '../hooks/use-image-selection';
import type { ResultSelection } from '../types';
import { CompareDialog } from './compare-dialog';
import { ResultsContent } from './results-content';
import { SelectionBar } from './selection-bar';
import { SelectionItem } from './selection-item';

/** Results of a completed inference session: one selection per statistic. */
export const InferenceResultsPage = ({
  selections,
}: {
  selections: readonly ResultSelection[];
}) => {
  const selection = useImageSelection();
  const [compareOpen, setCompareOpen] = useState(false);

  const openCompare = () => setCompareOpen(true);
  const closeCompare = () => setCompareOpen(false);

  const renderSelection = (item: ResultSelection) => (
    <SelectionItem
      key={item.id}
      selection={item}
      selectedIds={selection.ids}
      onToggleImage={selection.toggle}
    />
  );

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">{INFERENCE_RESULTS_TITLE}</Typography>
        <Typography color="text.secondary">
          {INFERENCE_RESULTS_SUBTITLE}
        </Typography>
      </Box>
      <ResultsContent spacing={1}>
        {selections.map(renderSelection)}
      </ResultsContent>
      <SelectionBar
        count={selection.images.length}
        onClear={selection.clear}
        onCompare={openCompare}
      />
      <CompareDialog
        open={compareOpen}
        images={selection.images}
        onClose={closeCompare}
      />
    </Stack>
  );
};
