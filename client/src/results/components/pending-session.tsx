import { Button, Typography } from '@mui/material';

import { LoadingState } from '@/shared/ui/states';

import { CANCEL_SESSION_LABEL, PENDING_MESSAGE } from '../consts';
import { PendingSessionRoot } from './pending-session.styles';

type PendingSessionProps = {
  isCanceling: boolean;
  onCancel: () => void;
};

/** Shown while a session waits to start, with a way to cancel it. */
export const PendingSession = ({
  isCanceling,
  onCancel,
}: PendingSessionProps) => (
  <PendingSessionRoot>
    <LoadingState />
    <Typography color="text.secondary">{PENDING_MESSAGE}</Typography>
    <Button
      variant="outlined"
      color="warning"
      loading={isCanceling}
      onClick={onCancel}
    >
      {CANCEL_SESSION_LABEL}
    </Button>
  </PendingSessionRoot>
);
