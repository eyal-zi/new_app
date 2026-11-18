import { Typography } from '@mui/material';

import { ImageGallery } from '@/shared/components/image-gallery/image-gallery';

import {
  RESULT_COLUMNS,
  RESULT_IMAGE_LABELS,
  SKELETON_TILE_COUNT,
} from '../consts';
import type { ResultImage, ResultSet as ResultSetData } from '../types';
import { ResultSetRoot, SkeletonGrid, SkeletonTile } from './result-set.styles';

const getImageId = (image: ResultImage) => image.id;
const getGalleryImage = ({ src, alt }: ResultImage) => ({
  src,
  alt,
  caption: alt,
});

const renderSkeleton = (_: unknown, index: number) => (
  <SkeletonTile key={index} variant="rectangular" />
);

export const ResultSet = ({ set }: { set: ResultSetData }) => {
  const heading = <Typography variant="h6">{set.title}</Typography>;

  if (set.status === 'loading') {
    return (
      <ResultSetRoot aria-busy="true" aria-label={set.title}>
        {heading}
        <SkeletonGrid role="status" aria-label={`Loading ${set.title}`}>
          {Array.from({ length: SKELETON_TILE_COUNT }, renderSkeleton)}
        </SkeletonGrid>
      </ResultSetRoot>
    );
  }

  const images: ResultImage[] = [
    {
      id: 'a',
      src: set.imageAUrl,
      alt: `${set.title} – ${RESULT_IMAGE_LABELS.a}`,
    },
    {
      id: 'evaluated',
      src: set.evaluatedImageUrl,
      alt: `${set.title} – ${RESULT_IMAGE_LABELS.evaluated}`,
    },
  ];

  return (
    <ResultSetRoot aria-label={set.title}>
      {heading}
      <ImageGallery
        items={images}
        getId={getImageId}
        getImage={getGalleryImage}
        label={set.title}
        columns={RESULT_COLUMNS}
      />
    </ResultSetRoot>
  );
};
