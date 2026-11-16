import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import DownloadIcon from '@mui/icons-material/Download';
import { CardActionArea, CardMedia } from '@mui/material';
import { type MouseEvent, useState } from 'react';

import { downloadFile } from '@/shared/utils/download-file';

import { type GalleryImage } from '../types';
import {
  DOWNLOAD_IMAGE_LABEL,
  SELECT_IMAGE_LABEL,
  TILE_HOVER_CONTROL_CLASS,
  TILE_MEDIA_CLASS,
  TILE_SELECT_CLASS,
} from './consts';
import {
  TileCaption,
  TileCaptionText,
  TileCard,
  TileDownloadButton,
  TileFallback,
  TileMedia,
  TileSelectCheckbox,
} from './image-gallery-tile.styles';

export type TileSelection = {
  selected: boolean;
  onChange: () => void;
};

type ImageGalleryTileProps = {
  image: GalleryImage;
  /** When omitted the tile is rendered as non-interactive. */
  onClick?: () => void;
  /**
   * Adds a checkbox shown on hover (always while selected). Ctrl/cmd + click
   * also toggles it, instead of calling `onClick`.
   */
  selection?: TileSelection;
  /** Show a download button on hover. Defaults to `true`. */
  downloadable?: boolean;
};

const stopPropagation = (event: MouseEvent) => event.stopPropagation();

export const ImageGalleryTile = ({
  image,
  onClick,
  selection,
  downloadable = true,
}: ImageGalleryTileProps) => {
  const src = image.thumbnailSrc ?? image.src;
  // Tracked per src so a new src retries loading without an effect.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const handleError = () => setFailedSrc(src);

  const handleDownload = async (event: MouseEvent) => {
    event.stopPropagation();
    setIsDownloading(true);

    try {
      await downloadFile(image.src, { fallbackName: image.alt });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClick = (event: MouseEvent) => {
    if (selection && (event.ctrlKey || event.metaKey)) {
      selection.onChange();
    } else {
      onClick?.();
    }
  };

  const isInteractive = !!onClick || !!selection;

  const media =
    failedSrc === src ? (
      <TileFallback role="img" aria-label={image.alt}>
        <BrokenImageIcon />
      </TileFallback>
    ) : (
      <CardMedia
        component="img"
        image={src}
        alt={image.alt}
        loading="lazy"
        onError={handleError}
      />
    );

  return (
    <TileCard role="listitem" selected={selection?.selected}>
      <TileMedia className={TILE_MEDIA_CLASS} data-interactive={isInteractive}>
        {isInteractive ? (
          <CardActionArea onClick={handleClick}>{media}</CardActionArea>
        ) : (
          media
        )}
        {/* Siblings of the action area: buttons can't nest inside a button. */}
        {selection && (
          <TileSelectCheckbox
            className={`${TILE_HOVER_CONTROL_CLASS} ${TILE_SELECT_CLASS}`}
            checked={selection.selected}
            onChange={selection.onChange}
            onClick={stopPropagation}
            slotProps={{
              input: { 'aria-label': `${SELECT_IMAGE_LABEL}: ${image.alt}` },
            }}
          />
        )}
        {downloadable && (
          <TileDownloadButton
            size="small"
            className={TILE_HOVER_CONTROL_CLASS}
            aria-label={`${DOWNLOAD_IMAGE_LABEL}: ${image.alt}`}
            disabled={isDownloading}
            onClick={(event) => void handleDownload(event)}
          >
            <DownloadIcon fontSize="small" />
          </TileDownloadButton>
        )}
      </TileMedia>
      {image.caption && (
        <TileCaption>
          <TileCaptionText>{image.caption}</TileCaptionText>
        </TileCaption>
      )}
    </TileCard>
  );
};
