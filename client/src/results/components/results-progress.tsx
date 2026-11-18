import { Typography } from '@mui/material';

import {
  PERCENT,
  PROGRESS_DECIMALS,
  PROGRESS_LABEL,
  RUNNING_MESSAGE,
} from '../consts';
import { ProgressBar, ResultsProgressRoot } from './results-progress.styles';

/** `progress` is a fraction from 0 to 1, or null when it is not known yet. */
type ResultsProgressProps = { progress: number | null };

export const ResultsProgress = ({ progress }: ResultsProgressProps) => {
  const isKnown = progress !== null;
  // `+` drops trailing zeros: 12.5 instead of 12.500.
  const rounded = isKnown
    ? +(progress * PERCENT).toFixed(PROGRESS_DECIMALS)
    : undefined;

  return (
    <ResultsProgressRoot role="status">
      <Typography>{RUNNING_MESSAGE}</Typography>
      <ProgressBar
        variant={isKnown ? 'determinate' : 'indeterminate'}
        value={rounded}
        aria-label={PROGRESS_LABEL}
      />
      {isKnown && <Typography variant="body2">{rounded}%</Typography>}
    </ResultsProgressRoot>
  );
};
