import { Button } from '@mui/material';

import { CANCEL_SESSION_LABEL } from '../consts';
import { ResultsProgress } from './results-progress';
import { RunningSessionRoot } from './running-session.styles';

type RunningSessionProps = {
  /** 0-100, or null when the progress is not known yet. */
  progress: number | null;
  isCanceling: boolean;
  onCancel: () => void;
};

/** Shown while a session is not in a terminal status, with a way to cancel it. */
export const RunningSession = ({
  progress,
  isCanceling,
  onCancel,
}: RunningSessionProps) => (
  <RunningSessionRoot>
    <ResultsProgress progress={progress} />
    <Button
      variant="outlined"
      color="warning"
      loading={isCanceling}
      onClick={onCancel}
    >
      {CANCEL_SESSION_LABEL}
    </Button>
  </RunningSessionRoot>
);
