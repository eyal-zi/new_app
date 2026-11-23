import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  SELECTABLE_IMAGE_ASPECT_RATIO,
  SELECTION_GRID_ROW_TITLE_WIDTH,
} from '../../consts';

export const GridRoot = styled('div', {
  shouldForwardProp: (prop) => prop !== 'columns',
})<{ columns: number }>(({ theme, columns }) => ({
  display: 'grid',
  gridTemplateColumns: `${theme.spacing(SELECTION_GRID_ROW_TITLE_WIDTH)} repeat(${columns}, minmax(0, 1fr))`,
  gap: theme.spacing(1),
  alignItems: 'center',
}));

export const ColumnTitle = styled(Typography)({ textAlign: 'center' });

export const RowTitle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
}));

export const EmptyCell = styled('div')(({ theme }) => ({
  aspectRatio: SELECTABLE_IMAGE_ASPECT_RATIO,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: (theme.vars ?? theme).palette.text.disabled,
}));
