import {
  Box,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Typography,
} from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

import {
  TILE_ASPECT_RATIO,
  TILE_HOVER_CONTROL_CLASS,
  TILE_HOVER_IMAGE_SCALE,
  TILE_HOVER_LIFT_SPACING,
  TILE_HOVER_SHADOW,
  TILE_MEDIA_CLASS,
  TILE_SELECT_CLASS,
  TILE_SELECTED_OUTLINE_WIDTH,
} from './consts';

const tileMediaStyles = ({ theme }: { theme: Theme }) => ({
  aspectRatio: TILE_ASPECT_RATIO,
  width: '100%',
  objectFit: 'cover' as const,
  backgroundColor: (theme.vars ?? theme).palette.action.hover,
});

const tileCardStyles = ({
  theme,
  selected,
}: {
  theme: Theme;
  selected?: boolean;
}) => ({
  outline: `${TILE_SELECTED_OUTLINE_WIDTH}px solid ${
    selected ? (theme.vars ?? theme).palette.primary.main : 'transparent'
  }`,
  outlineOffset: -TILE_SELECTED_OUTLINE_WIDTH,
  [`& .${TILE_HOVER_CONTROL_CLASS}`]: { opacity: 0 },
  [`& .${TILE_SELECT_CLASS}`]: { opacity: selected ? 1 : undefined },
  [`&:hover .${TILE_HOVER_CONTROL_CLASS}, &:focus-within .${TILE_HOVER_CONTROL_CLASS}`]:
    { opacity: 1 },
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '& .MuiCardMedia-root': {
    ...tileMediaStyles({ theme }),
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.easeOut,
    }),
  },
  // Clip the zoomed image to the media area, above the caption.
  '& .MuiCardActionArea-root': {
    overflow: 'hidden',
  },
  // Only interactive tiles animate; keyboard focus gets the same feedback.
  '@media (prefers-reduced-motion: no-preference)': {
    [`&:has(.${TILE_MEDIA_CLASS}[data-interactive='true']:hover), &:has(.MuiCardActionArea-root.Mui-focusVisible)`]:
      {
        transform: `translateY(${theme.spacing(TILE_HOVER_LIFT_SPACING)})`,
        boxShadow: theme.shadows[TILE_HOVER_SHADOW],
        '& .MuiCardMedia-root': {
          transform: `scale(${TILE_HOVER_IMAGE_SCALE})`,
        },
      },
  },
});
export const TileCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(tileCardStyles);

export const TileMedia = styled('div')({ position: 'relative' });

const tileControlStyles = ({ theme }: { theme: Theme }) => ({
  position: 'absolute' as const,
  top: theme.spacing(0.5),
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  transition: theme.transitions.create('opacity'),
  '&:hover': {
    backgroundColor: (theme.vars ?? theme).palette.background.paper,
  },
});

export const TileSelectCheckbox = styled(Checkbox)(
  tileControlStyles,
  ({ theme }) => ({
    left: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
  }),
);

export const TileDownloadButton = styled(IconButton)(
  tileControlStyles,
  ({ theme }) => ({
    right: theme.spacing(0.5),
  }),
);

const tileFallbackStyles = ({ theme }: { theme: Theme }) => ({
  ...tileMediaStyles({ theme }),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: (theme.vars ?? theme).palette.text.disabled,
});
export const TileFallback = styled(Box)(tileFallbackStyles);

const tileCaptionStyles = ({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(1, 1.5),
  '&:last-child': { paddingBottom: theme.spacing(1) },
});
export const TileCaption = styled(CardContent)(tileCaptionStyles);

const tileCaptionTextStyles = ({ theme }: { theme: Theme }) => ({
  ...theme.typography.body2,
  color: (theme.vars ?? theme).palette.text.secondary,
});
export const TileCaptionText = styled(Typography)(tileCaptionTextStyles);
