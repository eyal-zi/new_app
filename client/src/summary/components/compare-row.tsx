import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Typography } from '@mui/material';

import { ImageTile } from '@/shared/components/image-tile/image-tile';
import { FILE_SIZE_FALLBACK } from '@/shared/constants';
import { useImageFileSize } from '@/shared/queries/use-image-file-size';
import { formatFileSize } from '@/shared/utils/format-file-size';

import { COMPARE_TITLES } from '../consts';
import type { CompareImage } from '../types';
import { IconWrapper, Panel, Row, TileFrame } from './compare-row.styles';

export type CompareRowProps = {
  imageA?: CompareImage;
  imageB?: CompareImage;
};

const getCaption = (name: string, bytes: number | undefined) =>
  `${name} · ${bytes === undefined ? FILE_SIZE_FALLBACK : formatFileSize(bytes)}`;

export const CompareRow = ({ imageA, imageB }: CompareRowProps) => {
  const { data: bytesA } = useImageFileSize(imageA?.src);
  const { data: bytesB } = useImageFileSize(imageB?.src);

  const renderPanel = (title: string, image?: CompareImage, bytes?: number) => (
    <Panel>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {image && (
        <TileFrame>
          <ImageTile
            src={image.src}
            alt={image.alt}
            caption={getCaption(image.name, bytes)}
          />
        </TileFrame>
      )}
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
