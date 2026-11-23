import { Link, TableCell, TableRow } from '@mui/material';
import { Link as RouterLink, type LinkProps } from '@tanstack/react-router';

import { SessionType } from '@/api/generated/model';

import {
  FINISHED_SESSION_STATUSES,
  getResultsPath,
  NO_IMAGE_LABEL,
  SESSION_IMAGE_NAMES,
} from '../../consts';
import type {
  ImageOpener,
  Session,
  SessionAction,
  SessionActionHandler,
} from '../../types';
import { formatDateTime } from '../../utils/format';
import { ProgressCell } from '../progress-cell/progress-cell';
import { RowOptions } from '../row-options/row-options';
import { SessionImage } from '../session-image/session-image';
import { StatusTag } from '../status-tag/status-tag';
import { TypeTag } from '../type-tag/type-tag';
import { IdText } from './session-row.styles';

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
          src={session.variationaFileUrl}
          alt={`${session.id} - ${SESSION_IMAGE_NAMES.a}`}
          onOpen={onOpenImage}
        />
      </TableCell>
      <TableCell>
        {/* Evaluation sessions have a single image; the API sends an empty variationb image. */}
        {session.type === SessionType.evaluation ? (
          NO_IMAGE_LABEL
        ) : (
          <SessionImage
            src={session.variationbFileUrl}
            alt={`${session.id} - ${SESSION_IMAGE_NAMES.b}`}
            onOpen={onOpenImage}
          />
        )}
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
          to={getResultsPath(session.type, session.id) as LinkProps['to']}
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
