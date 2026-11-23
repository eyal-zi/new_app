// Also loaded by vite.config.ts in Node: keep imports to types and plain
// packages, no app aliases or UI modules.
import type { Accept } from 'react-dropzone';

export const REQUEST_TIMEOUT_MS = 15_000;
/** Uploads can be large and slow, so they get a longer timeout. */
export const UPLOAD_REQUEST_TIMEOUT_MS = 5 * 60_000;
/** How many upload requests run at once, so queued ones don't burn their timeout. */
export const MAX_CONCURRENT_UPLOADS = 4;

export const QUERY_STALE_TIME_MS = 30_000;
export const QUERY_GC_TIME_MS = 5 * 60_000;
export const MAX_QUERY_RETRIES = 2;

export const ERROR_AUTO_HIDE_DURATION_MS = 6000;
export const MAX_SNACKBARS = 3;

export const SESSION_STORAGE_KEY = 'session';

export const DEFAULT_TABLE_PAGE_SIZE = 5;
export const TABLE_PAGE_SIZE_OPTIONS = [DEFAULT_TABLE_PAGE_SIZE, 10, 20];

export const AUTH_MAX_ATTEMPTS = 3;
export const AUTH_POPUP_TIMEOUT_MS = 5 * 60_000;
export const AUTH_POPUP_POLL_MS = 300;
export const AUTH_POPUP_REOPEN_MS = 1000;

/** Used when a download has no file name from the caller or the URL. */
export const DEFAULT_DOWNLOAD_FILE_NAME = 'download';

/** The image types the app accepts for upload. */
export const JPEG_MIME_TYPE = 'image/jpeg';
export const PNG_MIME_TYPE = 'image/png';
export const SVG_MIME_TYPE = 'image/svg+xml';
export const JPEG_ACCEPT: Accept = { [JPEG_MIME_TYPE]: ['.jpg', '.jpeg'] };
export const PNG_ACCEPT: Accept = { [PNG_MIME_TYPE]: ['.png'] };
export const IMAGE_ACCEPT: Accept = { ...JPEG_ACCEPT, ...PNG_ACCEPT };
export const IMAGE_ACCEPT_DESCRIPTION = 'JPEG or PNG';

/**
 * The standard footprint of an upload area, in px: a dropzone, or the preview
 * that takes its place. Shared so every upload control lines up.
 */
export const UPLOAD_AREA_HEIGHT = 340;
export const UPLOAD_AREA_MAX_WIDTH = 720;

export const COLOR_MODE_STORAGE_KEY = 'color-mode';
export const COLOR_SCHEME_BACKGROUNDS = {
  light: '#f6f7fb',
  dark: '#0f111a',
} as const;

export const SUMMARY_TITLE = 'Summary';

export const PERCENT = 100;

export const IMAGE_DOWNLOAD_FORMATS = [
  { format: 'svg', label: 'SVG' },
  { format: 'png', label: 'PNG' },
  { format: 'jpeg', label: 'JPEG' },
] as const;

export type ImageDownloadFormat =
  (typeof IMAGE_DOWNLOAD_FORMATS)[number]['format'];

export const IMAGE_DOWNLOAD_MIME_TYPES: Record<ImageDownloadFormat, string> = {
  svg: SVG_MIME_TYPE,
  png: PNG_MIME_TYPE,
  jpeg: JPEG_MIME_TYPE,
};

/** Image extensions that a download format replaces rather than appends to. */
export const IMAGE_FILE_EXTENSION = /\.(svg|png|jpe?g|gif|webp|bmp|avif)$/i;

export const IMAGE_LOAD_ERROR = 'Failed to load image';
export const IMAGE_ENCODE_ERROR = 'Failed to encode image';
export const CANVAS_UNSUPPORTED_ERROR = 'Canvas is not supported';
export const CONVERSION_FAILED_MESSAGE =
  'Could not convert the image, downloading the original instead.';
export const FORMAT_UNAVAILABLE_MESSAGE =
  'Could not fetch the image to convert it, opening the original instead.';
