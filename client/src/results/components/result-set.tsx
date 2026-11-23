import { Typography } from '@mui/material';

import { ImageGallery } from '@/shared/components/image-gallery/image-gallery';

import {
  CANCEL_SESSION_LABEL,
  getLoadingLabel,
  RESULT_COLUMNS,
  RESULT_IMAGE_LABELS,
  SKELETON_TILE_COUNT,
} from '../consts';
import type { ResultImage, ResultSet as ResultSetData } from '../types';
import {
  CancelButton,
  ResultSetRoot,
  SkeletonGrid,
  SkeletonTile,
} from './result-set.styles';

const getImageId = (image: ResultImage) => image.id;
const getGalleryImage = ({ src, alt }: ResultImage) => ({
  src,
  alt,
  caption: alt,
});

const renderSkeleton = (_: unknown, index: number) => (
  <SkeletonTile key={index} variant="rectangular" />
);

type ResultSetProps = {
  set: ResultSetData;
  /** Called with the set's id; active sets show a cancel button when given. */
  onCancel?: (id: string) => void;
  /** Ids of the sets currently being canceled. */
  cancelingIds?: ReadonlySet<string>;
};

export const ResultSet = ({ set, onCancel, cancelingIds }: ResultSetProps) => {
  const heading = <Typography variant="h6">{set.title}</Typography>;

  // `active` sets look like `loading` ones, plus a way to cancel them.
  if (set.status === 'active' || set.status === 'loading') {
    return (
      <ResultSetRoot aria-busy="true" aria-label={set.title}>
        {heading}
        <SkeletonGrid role="status" aria-label={getLoadingLabel(set.title)}>
          {Array.from({ length: SKELETON_TILE_COUNT }, renderSkeleton)}
        </SkeletonGrid>
        {set.status === 'active' && onCancel && (
          <CancelButton
            variant="outlined"
            color="warning"
            loading={cancelingIds?.has(set.id)}
            onClick={() => onCancel(set.id)}
          >
            {CANCEL_SESSION_LABEL}
          </CancelButton>
        )}
      </ResultSetRoot>
    );
  }

  const images: ResultImage[] = [
    {
      id: 'variationa',
      src: set.variationaFileUrl,
      alt: RESULT_IMAGE_LABELS.variationa,
    },
    {
      id: 'evaluated',
      src: set.evaluatedImageUrl,
      alt: RESULT_IMAGE_LABELS.evaluated,
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
