import { Skeleton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  SELECTION_GRID_ROW_TITLE_WIDTH,
  SELECTION_SKELETON_HEIGHT,
} from '../consts';

export const GridRoot = styled('div', {
  shouldForwardProp: (prop) => prop !== 'columns',
})<{ columns: number }>(({ theme, columns }) => ({
  display: 'grid',
  gridTemplateColumns: `${theme.spacing(SELECTION_GRID_ROW_TITLE_WIDTH)} repeat(${columns}, minmax(0, 1fr))`,
  gap: theme.spacing(1),
  alignItems: 'center',
}));

export const ColumnTitle = styled(Typography)({ textAlign: 'center' });

export const RowTitle = styled(Typography)({ fontWeight: 500 });

export const GridSkeleton = styled(Skeleton)(({ theme }) => ({
  height: theme.spacing(SELECTION_SKELETON_HEIGHT),
  transform: 'none',
}));
