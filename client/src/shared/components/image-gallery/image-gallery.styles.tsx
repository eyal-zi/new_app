import { Box, Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

import { GALLERY_TILE_MIN_WIDTH } from './consts';

type GalleryGridProps = { gap: number; columns?: number };

const galleryGridStyles = ({
  theme,
  gap,
  columns,
}: GalleryGridProps & { theme: Theme }) => ({
  display: 'grid',
  gridTemplateColumns: columns
    ? `repeat(${columns}, minmax(0, 1fr))`
    : `repeat(auto-fill, minmax(min(${theme.spacing(GALLERY_TILE_MIN_WIDTH)}, 100%), 1fr))`,
  gap: theme.spacing(gap),
});
export const GalleryGrid = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'gap' && prop !== 'columns',
})<GalleryGridProps>(galleryGridStyles);

const emptyMessageStyles = ({ theme }: { theme: Theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(4),
  textAlign: 'center' as const,
  color: (theme.vars ?? theme).palette.text.secondary,
});
export const EmptyMessage = styled(Typography)(emptyMessageStyles);
