import DownloadIcon from '@mui/icons-material/Download';
import { Stack, Tooltip } from '@mui/material';
import { type MouseEvent, type ReactNode, type Ref, useState } from 'react';

import { ImageTile, type ImageTileProps } from '../image-tile/image-tile';
import { RemoveButton } from '../remove-button/remove-button';
import {
  TileDownloadButton,
  TileFrame,
  TileSelectCheckbox,
} from './actionable-image-tile.styles';
import {
  DELETE_IMAGE_LABEL,
  DOWNLOAD_IMAGE_LABEL,
  SELECT_IMAGE_LABEL,
  TILE_HOVER_CONTROL_CLASS,
  TILE_SELECT_CLASS,
} from './consts';

export type TileSelection = {
  selected: boolean;
  onChange: () => void;
};

export type ActionableImageTileProps = Omit<ImageTileProps, 'action'> & {
  /**
   * Adds a checkbox shown on hover (always while selected). Ctrl/cmd + click
   * also toggles it, instead of calling `onClick`.
   */
  selection?: TileSelection;
  /** Shows a download button on hover. May be async to show a busy state. */
  onDownload?: () => void | Promise<void>;
  /** Shows a delete button on hover. */
  onDelete?: () => void;
  /**
   * Whether the controls (select, download, delete) only show on hover or
   * focus. Defaults to `true`; pass `false` to keep them always visible, e.g.
   * where there's no hover. A selected tile always shows its checkbox.
   */
  controlsOnHover?: boolean;
  /** Lets the caller move focus to the delete button, e.g. after a neighbour is removed. */
  deleteButtonRef?: Ref<HTMLButtonElement>;
};

const stopPropagation = (event: MouseEvent) => event.stopPropagation();

/**
 * An `ImageTile` with optional select / download / delete controls. Each
 * control only appears when its callback is passed.
 */
export const ActionableImageTile = ({
  selection,
  onDownload,
  onDelete,
  controlsOnHover = true,
  deleteButtonRef,
  onClick,
  ...tileProps
}: ActionableImageTileProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (event: MouseEvent) => {
    event.stopPropagation();

    if (isDownloading) {
      return;
    }

    setIsDownloading(true);

    try {
      await onDownload?.();
    } finally {
      setIsDownloading(false);
    }
  };

  // Capture phase, so the tile's own click handler never sees a toggle click.
  const handleClickCapture = (event: MouseEvent) => {
    if (selection && (event.ctrlKey || event.metaKey)) {
      event.stopPropagation();
      selection.onChange();
    }
  };

  // A selectable tile stays clickable, so ctrl/cmd + click has a target.
  const handleClick = onClick ?? (selection ? () => undefined : undefined);

  const hoverControlClass = controlsOnHover
    ? TILE_HOVER_CONTROL_CLASS
    : undefined;
  const downloadLabel = `${DOWNLOAD_IMAGE_LABEL}: ${tileProps.alt}`;
  const deleteLabel = `${DELETE_IMAGE_LABEL}: ${tileProps.alt}`;

  const actions: ReactNode =
    onDownload || onDelete ? (
      <Stack direction="row" spacing={0.5} className={hoverControlClass}>
        {onDownload && (
          <Tooltip title={downloadLabel}>
            <TileDownloadButton
              aria-label={downloadLabel}
              aria-busy={isDownloading}
              onClick={(event) => void handleDownload(event)}
            >
              <DownloadIcon />
            </TileDownloadButton>
          </Tooltip>
        )}
        {onDelete && (
          <RemoveButton
            ref={deleteButtonRef}
            label={deleteLabel}
            onClick={onDelete}
          />
        )}
      </Stack>
    ) : undefined;

  return (
    <TileFrame
      selected={!!selection?.selected}
      onClickCapture={handleClickCapture}
    >
      <ImageTile {...tileProps} onClick={handleClick} action={actions} />
      {selection && (
        <TileSelectCheckbox
          className={[hoverControlClass, TILE_SELECT_CLASS]
            .filter(Boolean)
            .join(' ')}
          checked={selection.selected}
          onChange={selection.onChange}
          onClick={stopPropagation}
          slotProps={{
            input: {
              'aria-label': `${SELECT_IMAGE_LABEL}: ${tileProps.alt}`,
            },
          }}
        />
      )}
    </TileFrame>
  );
};
