import { Stack, Typography } from '@mui/material';

import { ImageGallery } from '@/shared/components/image-gallery/image-gallery';
import type { GalleryImage } from '@/shared/components/image-gallery/types';

import {
  SUMMARY_GALLERY_COLUMNS,
  SUMMARY_IMAGES_LABEL,
  SUMMARY_TITLE,
} from '../consts';

type SummaryImage = GalleryImage & { id: string };

const getId = (image: SummaryImage) => image.id;
const getImage = (image: SummaryImage) => image;

export const SummaryPage = () => {
  // TODO: get the images from the store.
  const images: SummaryImage[] = [];

  return (
    <Stack spacing={3}>
      <Typography variant="h4">{SUMMARY_TITLE}</Typography>
      <ImageGallery
        items={images}
        getId={getId}
        getImage={getImage}
        label={SUMMARY_IMAGES_LABEL}
        columns={SUMMARY_GALLERY_COLUMNS}
      />
    </Stack>
  );
};
