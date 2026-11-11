import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Typography } from '@mui/material';

import { ImageGalleryTile } from '@/shared/components/image-gallery/image-gallery-tile/image-gallery-tile';
import type { GalleryImage } from '@/shared/components/image-gallery/types';

import { COMPARE_IMAGES, FILE_SIZE_FALLBACK } from '../consts';
import { useImageFileSize } from '../hooks/use-image-file-size';
import { formatFileSize } from '../utils/format-file-size';
import { IconWrapper, Panel, Row } from './compare-row.styles';

type CompareImageConfig = (typeof COMPARE_IMAGES)['a'];

const getImage = (
  { src, alt, name }: CompareImageConfig,
  bytes: number | undefined,
): GalleryImage => ({
  src,
  alt,
  caption: `${name} · ${bytes === undefined ? FILE_SIZE_FALLBACK : formatFileSize(bytes)}`,
});

export const CompareRow = () => {
  const { data: bytesA } = useImageFileSize(COMPARE_IMAGES.a.src);
  const { data: bytesB } = useImageFileSize(COMPARE_IMAGES.b.src);

  const renderPanel = (config: CompareImageConfig, bytes?: number) => (
    <Panel>
      <Typography variant="h6" gutterBottom>
        {config.title}
      </Typography>
      <ImageGalleryTile image={getImage(config, bytes)} />
    </Panel>
  );

  return (
    <Row direction="row">
      {renderPanel(COMPARE_IMAGES.a, bytesA)}
      <IconWrapper>
        <CompareArrowsIcon fontSize="large" />
      </IconWrapper>
      {renderPanel(COMPARE_IMAGES.b, bytesB)}
    </Row>
  );
};
