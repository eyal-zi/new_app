import { Button, Typography } from '@mui/material';

import { LoadingState } from '@/shared/ui/states';

import { CANCEL_SESSION_LABEL, RUNNING_MESSAGE } from '../consts';
import { RunningSessionRoot } from './running-session.styles';

type RunningSessionProps = {
  isCanceling: boolean;
  onCancel: () => void;
};

/** Shown while a session waits to start, with a way to cancel it. */
export const RunningSession = ({
  isCanceling,
  onCancel,
}: RunningSessionProps) => (
  <RunningSessionRoot>
    <LoadingState />
    <Typography color="text.secondary">{RUNNING_MESSAGE}</Typography>
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
