import { styled } from '@mui/material/styles';

import {
  ZOOM_CONTENT_CLASS,
  ZOOM_WRAPPER_CLASS,
} from '@/shared/components/image-gallery/image-lightbox/consts';

export const PaneRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  minHeight: 0,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

export const PaneHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 1, 0.5, 1.5),
}));

export const PaneStage = styled('div')({
  flex: 1,
  minHeight: 0,
  [`& .${ZOOM_WRAPPER_CLASS}, & .${ZOOM_CONTENT_CLASS}`]: {
    width: '100%',
    height: '100%',
  },
  [`& .${ZOOM_WRAPPER_CLASS}`]: {
    cursor: 'grab',
    '&:active': { cursor: 'grabbing' },
  },
  [`& .${ZOOM_CONTENT_CLASS}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    userSelect: 'none',
  },
});
