import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Typography } from '@mui/material';

import { ImageGalleryTile } from '@/shared/components/image-gallery/image-gallery-tile/image-gallery-tile';
import type { GalleryImage } from '@/shared/components/image-gallery/types';

import { COMPARE_TITLES, FILE_SIZE_FALLBACK } from '../consts';
import { useImageFileSize } from '../hooks/use-image-file-size';
import type { CompareImage } from '../types';
import { formatFileSize } from '../utils/format-file-size';
import { IconWrapper, Panel, Row } from './compare-row.styles';

export type CompareRowProps = {
  imageA?: CompareImage;
  imageB?: CompareImage;
};

const getImage = (
  { src, alt, name }: CompareImage,
  bytes: number | undefined,
): GalleryImage => ({
  src,
  alt,
  caption: `${name} · ${bytes === undefined ? FILE_SIZE_FALLBACK : formatFileSize(bytes)}`,
});

export const CompareRow = ({ imageA, imageB }: CompareRowProps) => {
  const { data: bytesA } = useImageFileSize(imageA?.src);
  const { data: bytesB } = useImageFileSize(imageB?.src);

  const renderPanel = (title: string, image?: CompareImage, bytes?: number) => (
    <Panel>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {image && <ImageGalleryTile image={getImage(image, bytes)} />}
    </Panel>
  );

  return (
    <Row direction="row">
      {renderPanel(COMPARE_TITLES.a, imageA, bytesA)}
      <IconWrapper>
        <CompareArrowsIcon fontSize="large" />
      </IconWrapper>
      {renderPanel(COMPARE_TITLES.b, imageB, bytesB)}
    </Row>
  );
};
