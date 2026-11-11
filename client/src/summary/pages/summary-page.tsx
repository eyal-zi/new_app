import { Stack, Typography } from '@mui/material';

import { ImageGallery } from '@/shared/components/image-gallery/image-gallery';

import { SUMMARY_GALLERY_COLUMNS, SUMMARY_IMAGES } from '../consts';

const getId = (image: (typeof SUMMARY_IMAGES)[number]) => image.id;
const getImage = (image: (typeof SUMMARY_IMAGES)[number]) => image;

export const SummaryPage = () => (
  <Stack spacing={3}>
    <Typography variant="h4">Summary</Typography>
    <ImageGallery
      items={SUMMARY_IMAGES}
      getId={getId}
      getImage={getImage}
      label="Summary images"
      columns={SUMMARY_GALLERY_COLUMNS}
    />
  </Stack>
);
