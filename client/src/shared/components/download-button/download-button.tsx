import DownloadIcon from '@mui/icons-material/Download';
import {
  CircularProgress,
  IconButton,
  type IconButtonProps,
  Tooltip,
} from '@mui/material';
import { type ComponentType, type MouseEvent, useState } from 'react';

import { type ImageDownloadFormat } from '@/shared/constants';

import { DownloadFormatOptions } from '../download-format-options/download-format-options';
import { DOWNLOADING_PROGRESS_SIZE } from './consts';
import { DownloadButtonWrapper } from './download-button.styles';

type DownloadButtonProps = {
  /** Accessible name of the button and of its format options. */
  label: string;
  /** Called with no format when the button is clicked (download as is). May be async. */
  onDownload: (format?: ImageDownloadFormat) => void | Promise<void>;
  /** The button to render, e.g. a styled `IconButton`. Defaults to `IconButton`. */
  ButtonComponent?: ComponentType<IconButtonProps>;
};

/**
 * A download icon button whose tooltip offers the `IMAGE_DOWNLOAD_FORMATS`.
 * Shows a spinner and ignores clicks while a download runs.
 */
export const DownloadButton = ({
  label,
  onDownload,
  ButtonComponent = IconButton,
}: DownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = async (event: MouseEvent, format?: ImageDownloadFormat) => {
    // Portal events bubble through React, e.g. to a clickable tile.
    event.stopPropagation();

    if (isDownloading) {
      return;
    }

    setIsDownloading(true);

    try {
      await onDownload(format);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Tooltip
      title={
        <DownloadFormatOptions
          label={label}
          disabled={isDownloading}
          onSelect={(event, format) => void download(event, format)}
        />
      }
    >
      <DownloadButtonWrapper>
        <ButtonComponent
          aria-label={label}
          aria-busy={isDownloading}
          disabled={isDownloading}
          onClick={(event) => void download(event)}
        >
          {isDownloading ? (
            <CircularProgress size={DOWNLOADING_PROGRESS_SIZE} />
          ) : (
            <DownloadIcon />
          )}
        </ButtonComponent>
      </DownloadButtonWrapper>
    </Tooltip>
  );
};
