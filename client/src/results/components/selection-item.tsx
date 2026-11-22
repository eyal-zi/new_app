import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccordionDetails, AccordionSummary, Typography } from '@mui/material';

import type { ResultSelection, SelectedImage } from '../types';
import { SelectionGrid } from './selection-grid';
import { SelectionAccordion } from './selection-item.styles';

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
  return (
    // Uncontrolled and closed by default.
    <SelectionAccordion
      disableGutters
      slotProps={{ transition: { unmountOnExit: true } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{selection.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <SelectionGrid
          selectionId={selection.id}
          selectedIds={selectedIds}
          onToggleImage={onToggleImage}
          columnTitles={selection.columnTitles}
          rows={selection.rows}
        />
      </AccordionDetails>
    </SelectionAccordion>
  );
};
