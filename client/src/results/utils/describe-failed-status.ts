import { SessionStatus } from '@/api/generated/model';

/** Completes "This session ..." for a failed or canceled session. */
export const describeFailedStatus = (status: SessionStatus) =>
  status === SessionStatus.canceled ? 'was canceled' : 'failed';
