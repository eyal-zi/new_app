import { Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';

import { TILE_ACTION_INSET } from '../image-tile/consts';
import {
  FROSTED_BACKGROUND_OPACITY,
  FROSTED_BLUR,
} from '../remove-button/consts';
import { FrostedIconButton } from '../remove-button/remove-button.styles';
import {
  TILE_HOVER_CONTROL_CLASS,
  TILE_SELECT_CLASS,
  TILE_SELECTED_OUTLINE_WIDTH,
} from './consts';

// Fills its container, like the tile it wraps.
export const TileFrame = styled('div', {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected: boolean }>(({ theme, selected }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  [`& .${TILE_HOVER_CONTROL_CLASS}`]: {
    opacity: 0,
    transition: theme.transitions.create('opacity'),
  },
  [`& .${TILE_SELECT_CLASS}`]: { opacity: selected ? 1 : undefined },
  [`&:hover .${TILE_HOVER_CONTROL_CLASS}, &:focus-within .${TILE_HOVER_CONTROL_CLASS}`]:
    { opacity: 1 },
  // Drawn above the tile so the image can't cover it.
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    borderRadius: theme.shape.borderRadius,
    outline: `${TILE_SELECTED_OUTLINE_WIDTH}px solid ${
      selected ? (theme.vars ?? theme).palette.primary.main : 'transparent'
    }`,
    outlineOffset: -TILE_SELECTED_OUTLINE_WIDTH,
  },
}));

// Frosted like the remove button, so the controls read as one set.
export const TileSelectCheckbox = styled(Checkbox)(({ theme }) => {
  const { palette } = theme.vars ?? theme;

  return {
    position: 'absolute',
    top: theme.spacing(TILE_ACTION_INSET),
    left: theme.spacing(TILE_ACTION_INSET),
    zIndex: 1,
    // Same as IconButton's padding, so it matches the action buttons' size.
    padding: theme.spacing(1),
    borderRadius: '50%',
    backgroundColor: theme.alpha(
      palette.background.paper,
      FROSTED_BACKGROUND_OPACITY,
    ),
    backdropFilter: FROSTED_BLUR,
    '&:hover': { backgroundColor: palette.background.paper },
  };
});

export const TileDownloadButton = styled(FrostedIconButton)(({ theme }) => ({
  '&:hover': {
    color: (theme.vars ?? theme).palette.primary.main,
  },
}));
