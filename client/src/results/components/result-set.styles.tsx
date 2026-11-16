import { Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

import { RESULT_COLUMNS, SKELETON_TILE_HEIGHT } from '../consts';

export const ResultSetRoot = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const SkeletonGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${RESULT_COLUMNS}, minmax(0, 1fr))`,
  gap: theme.spacing(1),
}));

export const SkeletonTile = styled(Skeleton)(({ theme }) => ({
  height: theme.spacing(SKELETON_TILE_HEIGHT),
  transform: 'none',
}));
