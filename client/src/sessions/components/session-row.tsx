import { Link, TableCell, TableRow } from '@mui/material';
import { Link as RouterLink, type LinkProps } from '@tanstack/react-router';

import { FINISHED_SESSION_STATUSES, getResultsPath } from '../consts';
import type {
  ImageOpener,
  Session,
  SessionAction,
  SessionActionHandler,
} from '../types';
import { formatDateTime } from '../utils/format';
import { ProgressCell } from './progress-cell';
import { RowOptions } from './row-options';
import { SessionImage } from './session-image';
import { IdText } from './session-row.styles';
import { StatusTag } from './status-tag';
import { TypeTag } from './type-tag';

export const SessionRow = ({
  session,
  onAction,
  onOpenImage,
}: {
  session: Session;
  onAction: SessionActionHandler;
  onOpenImage: ImageOpener;
}) => {
  const actions: SessionAction[] = FINISHED_SESSION_STATUSES.has(session.status)
    ? ['delete']
    : ['cancel'];
  const requestAction = (action: SessionAction) => onAction(session, action);

  return (
    <TableRow hover>
      <TableCell>
        <IdText title={session.id}>{session.id}</IdText>
      </TableCell>
      <TableCell>
        <TypeTag type={session.type} />
      </TableCell>
      <TableCell>{session.owner}</TableCell>
      <TableCell>
        <SessionImage
          src={session.imageAUrl}
          alt="Image A"
          onOpen={onOpenImage}
        />
      </TableCell>
      <TableCell>
        <SessionImage
          src={session.imageBUrl}
          alt="Image B"
          onOpen={onOpenImage}
        />
      </TableCell>
      <TableCell>{formatDateTime(session.createdAt)}</TableCell>
      <TableCell>{formatDateTime(session.updatedAt)}</TableCell>
      <TableCell>
        <ProgressCell value={session.progress} />
      </TableCell>
      <TableCell>
        <StatusTag status={session.status} />
      </TableCell>
      <TableCell>
        <Link
          component={RouterLink}
          to={getResultsPath(session.id) as LinkProps['to']}
        >
          Results
        </Link>
      </TableCell>
      <TableCell align="right">
        <RowOptions
          sessionId={session.id}
          actions={actions}
          onSelect={requestAction}
        />
      </TableCell>
    </TableRow>
  );
};
