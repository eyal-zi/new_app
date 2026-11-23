import { useState } from 'react';

import { ActionableImageTile } from '@/shared/components/actionable-image-tile/actionable-image-tile';
import { ImageLightbox } from '@/shared/components/image-gallery/image-lightbox/image-lightbox';
import { downloadFile } from '@/shared/utils/download-file';

import type { SelectedImage } from '../../types';
import { SelectableImageFrame } from './selectable-image.styles';

type SelectableImageProps = {
  image: SelectedImage;
  selected: boolean;
  onToggle: (image: SelectedImage) => void;
};

/** A gallery tile with its own single-image lightbox, opened on click. */
export const SelectableImage = ({
  image,
  selected,
  onToggle,
}: SelectableImageProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);
  const toggle = () => onToggle(image);

  const download = () => downloadFile(image.src, { fallbackName: image.label });

  const galleryImage = { src: image.src, alt: image.label };

  return (
    <>
      <SelectableImageFrame>
        <ActionableImageTile
          src={image.src}
          alt={image.label}
          onClick={openLightbox}
          onDownload={download}
          selection={{ selected, onChange: toggle }}
        />
      </SelectableImageFrame>
      {/* Outside the tile: portal events bubble through React and would re-trigger its click handler. */}
      <ImageLightbox
        open={lightboxOpen}
        image={{ ...galleryImage, caption: image.label }}
        imageId={image.id}
        onClose={closeLightbox}
      />
    </>
  );
};
