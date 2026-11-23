import { Button, Tooltip, Typography } from '@mui/material';

import {
  CLEAR_SELECTION_LABEL,
  COMPARE_HINT,
  COMPARE_LABEL,
  COMPARE_MIN_IMAGES,
  getSelectedCountLabel,
  SELECTION_BAR_ELEVATION,
} from '../../consts';
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
      <Typography aria-live="polite">{getSelectedCountLabel(count)}</Typography>
      <Button onClick={onClear}>{CLEAR_SELECTION_LABEL}</Button>
      <Tooltip title={canCompare ? '' : COMPARE_HINT}>
        <span>
          <Button
            variant="contained"
            disabled={!canCompare}
            onClick={onCompare}
          >
            {COMPARE_LABEL}
          </Button>
        </span>
      </Tooltip>
    </SelectionBarRoot>
  );
};
