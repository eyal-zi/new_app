import { Button, Tooltip, Typography } from '@mui/material';

import {
  COMPARE_HINT,
  COMPARE_MIN_IMAGES,
  SELECTION_BAR_ELEVATION,
} from '../consts';
import { SelectionBarRoot } from './selection-bar.styles';

type SelectionBarProps = {
  count: number;
  onClear: () => void;
  onCompare: () => void;
};

export const SelectionBar = ({
  count,
  onClear,
  onCompare,
}: SelectionBarProps) => {
  if (count === 0) {
    return null;
  }

  const canCompare = count >= COMPARE_MIN_IMAGES;

  return (
    <SelectionBarRoot elevation={SELECTION_BAR_ELEVATION}>
      <Typography aria-live="polite">{count} selected</Typography>
      <Button onClick={onClear}>Clear</Button>
      <Tooltip title={canCompare ? '' : COMPARE_HINT}>
        <span>
          <Button
            variant="contained"
            disabled={!canCompare}
            onClick={onCompare}
          >
            Compare
          </Button>
        </span>
      </Tooltip>
    </SelectionBarRoot>
  );
};
