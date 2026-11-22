import type { MouseEvent } from 'react';

import {
  IMAGE_DOWNLOAD_FORMATS,
  type ImageDownloadFormat,
} from '@/shared/constants';

import { DOWNLOAD_AS_LABEL } from './consts';
import { FormatButton, FormatOptions } from './download-format-options.styles';

type DownloadFormatOptionsProps = {
  /** Accessible name of the group. */
  label: string;
  onSelect: (event: MouseEvent, format: ImageDownloadFormat) => void;
};

/** SVG / PNG / JPEG buttons, meant as the content of a download button's tooltip. */
export const DownloadFormatOptions = ({
  label,
  onSelect,
}: DownloadFormatOptionsProps) => (
  <FormatOptions role="group" aria-label={label}>
    {`${DOWNLOAD_AS_LABEL}:`}
    {IMAGE_DOWNLOAD_FORMATS.map(({ format, label: formatLabel }) => (
      <FormatButton
        key={format}
        size="small"
        onClick={(event) => onSelect(event, format)}
      >
        {formatLabel}
      </FormatButton>
    ))}
  </FormatOptions>
);
