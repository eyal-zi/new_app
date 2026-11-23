import { Typography } from '@mui/material';

import { PERCENT } from '@/shared/constants';

import { formatPercent } from '../../utils/format';
import { ProgressBar, ProgressCellRoot } from './progress-cell.styles';

/** `value` is a fraction from 0 to 1. */
export const ProgressCell = ({ value }: { value: number | null }) => {
  if (value === null) {
    return null;
  }

  return (
    <ProgressCellRoot>
      <ProgressBar variant="determinate" value={value * PERCENT} />
      <Typography variant="body2">{formatPercent(value)}</Typography>
    </ProgressCellRoot>
  );
};
