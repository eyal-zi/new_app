import { Typography } from '@mui/material';

import { PROGRESS_DECIMALS, RUNNING_MESSAGE } from '../consts';
import { ProgressBar, ResultsProgressRoot } from './results-progress.styles';

type ResultsProgressProps = { progress: number | null };

export const ResultsProgress = ({ progress }: ResultsProgressProps) => {
  const isKnown = progress !== null;
  // `+` drops trailing zeros: 12.5 instead of 12.500.
  const rounded = isKnown ? +progress.toFixed(PROGRESS_DECIMALS) : undefined;

  return (
    <ResultsProgressRoot role="status">
      <Typography>{RUNNING_MESSAGE}</Typography>
      <ProgressBar
        variant={isKnown ? 'determinate' : 'indeterminate'}
        value={rounded}
        aria-label="Results progress"
      />
      {isKnown && <Typography variant="body2">{rounded}%</Typography>}
    </ResultsProgressRoot>
  );
};
