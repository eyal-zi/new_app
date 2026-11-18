import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Typography,
} from '@mui/material';

import type { ResultSelection, SelectedImage } from '../types';
import { SelectionGrid } from './selection-grid';
import { GridSkeleton } from './selection-grid.styles';
import { SelectionAccordion, SummaryContent } from './selection-item.styles';

type SelectionItemProps = {
  selection: ResultSelection;
  selectedIds: ReadonlySet<string>;
  onToggleImage: (image: SelectedImage) => void;
};

export const SelectionItem = ({
  selection,
  selectedIds,
  onToggleImage,
}: SelectionItemProps) => {
  const isLoading = selection.status === 'loading';

  return (
    // Uncontrolled and closed by default.
    <SelectionAccordion
      disableGutters
      slotProps={{ transition: { unmountOnExit: true } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <SummaryContent>
          <Typography variant="h6">{selection.title}</Typography>
          {isLoading && <CircularProgress size={18} aria-label="Loading" />}
        </SummaryContent>
      </AccordionSummary>
      <AccordionDetails>
        {selection.status === 'loading' ? (
          <GridSkeleton
            variant="rectangular"
            role="status"
            aria-label={`Loading ${selection.title}`}
          />
        ) : (
          <SelectionGrid
            selectionId={selection.id}
            selectedIds={selectedIds}
            onToggleImage={onToggleImage}
            columnTitles={selection.columnTitles}
            rows={selection.rows}
          />
        )}
      </AccordionDetails>
    </SelectionAccordion>
  );
};
