import { Typography } from '@mui/material';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import {
  LIGHTBOX_MAX_SCALE,
  LIGHTBOX_MIN_SCALE,
} from '@/shared/components/image-gallery/image-lightbox/consts';
import { LightboxControls } from '@/shared/components/image-gallery/image-lightbox/lightbox-controls/lightbox-controls';

import type { SelectedImage } from '../../types';
import { PaneHeader, PaneRoot, PaneStage } from './compare-pane.styles';

/** Each pane owns its own transform, so zoom and pan are independent. */
export const ComparePane = ({ image }: { image: SelectedImage }) => (
  <PaneRoot>
    <TransformWrapper
      minScale={LIGHTBOX_MIN_SCALE}
      maxScale={LIGHTBOX_MAX_SCALE}
      doubleClick={{ mode: 'toggle' }}
    >
      <PaneHeader>
        <Typography variant="body2" noWrap title={image.label}>
          {image.label}
        </Typography>
        <LightboxControls image={{ src: image.src, alt: image.label }} />
      </PaneHeader>
      <PaneStage>
        <TransformComponent>
          <img src={image.src} alt={image.label} draggable={false} />
        </TransformComponent>
      </PaneStage>
    </TransformWrapper>
  </PaneRoot>
);
