import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  SCORE_RING_SIZE,
  SCORE_RING_TRACK_OPACITY,
  SELECTABLE_IMAGE_ASPECT_RATIO,
} from '../consts';

export const ScoreFrame = styled('div')({
  aspectRatio: SELECTABLE_IMAGE_ASPECT_RATIO,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const RingWrapper = styled('div')({
  position: 'relative',
  display: 'inline-flex',
  width: SCORE_RING_SIZE,
  height: SCORE_RING_SIZE,
});

const ringBase = { position: 'absolute', inset: 0 } as const;

export const RingTrack = styled(CircularProgress)({
  ...ringBase,
  color: 'currentColor',
  opacity: SCORE_RING_TRACK_OPACITY,
});

export const RingValue = styled(CircularProgress, {
  shouldForwardProp: (prop) => prop !== 'ringColor',
})<{ ringColor: string }>(({ ringColor }) => ({
  ...ringBase,
  color: ringColor,
}));

export const RingLabel = styled('div')({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
