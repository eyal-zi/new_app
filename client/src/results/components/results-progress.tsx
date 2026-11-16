import { Typography } from '@mui/material';

import { ProgressBar, ResultsProgressRoot } from './results-progress.styles';

type ResultsProgressProps = { progress: number | null };

export const ResultsProgress = ({ progress }: ResultsProgressProps) => {
  const isKnown = progress !== null;

  return (
    <ResultsProgressRoot role="status">
      <Typography>Results are still loading…</Typography>
      <ProgressBar
        variant={isKnown ? 'determinate' : 'indeterminate'}
        value={progress ?? undefined}
        aria-label="Results progress"
      />
      {isKnown && <Typography variant="body2">{progress}%</Typography>}
    </ResultsProgressRoot>
  );
};
