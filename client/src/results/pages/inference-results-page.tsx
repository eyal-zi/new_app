import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { CompareDialog } from '../components/compare-dialog';
import { SelectionBar } from '../components/selection-bar';
import { SelectionItem } from '../components/selection-item';
import { useImageSelection } from '../hooks/use-image-selection';
import type { ResultSelection } from '../types';
import { ResultsContent } from './results-page.styles';

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
        <Typography variant="h4">Inference results</Typography>
        <Typography color="text.secondary">
          Expand a selection to compare its images. Ctrl/Cmd + click an image,
          or use its checkbox, to select it.
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
