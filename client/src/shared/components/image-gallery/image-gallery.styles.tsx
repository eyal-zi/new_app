import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { GALLERY_TILE_ASPECT_RATIO, GALLERY_TILE_MIN_WIDTH } from './consts';

type GalleryGridProps = { gap: number; columns?: number };

export const GalleryGrid = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'gap' && prop !== 'columns',
})<GalleryGridProps>(({ theme, gap, columns }) => {
  const minWidth = theme.spacing(GALLERY_TILE_MIN_WIDTH);
  // `columns` is a maximum: tiles never get narrower than the minimum width,
  // so narrow screens drop columns instead of squeezing the tiles.
  const trackWidth =
    columns === undefined
      ? `min(${minWidth}, 100%)`
      : `min(max(${minWidth}, calc((100% - ${columns - 1} * ${theme.spacing(gap)}) / ${columns})), 100%)`;

  return {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${trackWidth}, 1fr))`,
    gap: theme.spacing(gap),
  };
});

export const GalleryItem = styled(Box)({
  aspectRatio: GALLERY_TILE_ASPECT_RATIO,
});

export const EmptyMessage = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(4),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
}));
