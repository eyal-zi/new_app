import { enqueueSnackbar } from 'notistack';

import {
  CONVERSION_FAILED_MESSAGE,
  DEFAULT_DOWNLOAD_FILE_NAME,
  FORMAT_UNAVAILABLE_MESSAGE,
  IMAGE_FILE_EXTENSION,
  type ImageDownloadFormat,
} from '@/shared/constants';

import { convertImageBlob } from './convert-image';

export type DownloadFileOptions = {
  /** Name to save the file as. Defaults to the file name in the URL. */
  fileName?: string;
  /** Used when there's no `fileName` and the URL has no file name. */
  fallbackName?: string;
  /** Converts the image to this format first; its extension replaces an existing image extension. */
  format?: ImageDownloadFormat;
};

const NON_FILE_NAME_CHARS = /[^a-z0-9. -]+/gi;
const EDGE_SEPARATORS = /^[\s-]+|[\s-]+$/g;

/** Keeps letters, digits, dots, spaces and dashes, so `id - name` stays readable. */
const toFileName = (text: string) =>
  text.replace(NON_FILE_NAME_CHARS, '-').replace(EDGE_SEPARATORS, '');

const hasExtension = (name: string) => name.includes('.');

const getUrlFileName = (url: string) => {
  const lastSegment = new URL(url, window.location.href).pathname
    .split('/')
    .pop();

  return lastSegment && hasExtension(lastSegment)
    ? decodeURIComponent(lastSegment)
    : undefined;
};

const getExtension = (mimeType: string) =>
  mimeType.split('/')[1]?.split(/[+;]/)[0];

const withExtension = (name: string, mimeType: string) => {
  const extension = getExtension(mimeType);

  return hasExtension(name) || !extension ? name : `${name}.${extension}`;
};

const resolveFileName = (
  url: string,
  mimeType: string,
  { fileName, fallbackName, format }: DownloadFileOptions,
) => {
  const name =
    fileName ??
    getUrlFileName(url) ??
    (fallbackName && toFileName(fallbackName)) ??
    DEFAULT_DOWNLOAD_FILE_NAME;

  if (format) {
    // Only an image extension is swapped, so `model.v2` or `Epoch 1.5` keep their dots.
    const baseName = name.replace(IMAGE_FILE_EXTENSION, '');
    const extension = getExtension(mimeType);

    return `${baseName || DEFAULT_DOWNLOAD_FILE_NAME}${extension ? `.${extension}` : ''}`;
  }

  return withExtension(name, mimeType);
};

/** Saves an in-memory file, e.g. a generated CSV. */
export const downloadBlob = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = fileName;
  link.click();
  // Revoking synchronously can cancel the download in Firefox and Safari.
  setTimeout(() => URL.revokeObjectURL(objectUrl));
};

const fetchBlob = async (url: string) => {
  try {
    const response = await fetch(url);

    return response.ok ? await response.blob() : null;
  } catch {
    return null;
  }
};

/**
 * Downloads the file at `url`. Fetches it as a blob because browsers ignore
 * `download` on cross-origin links; if the file can't be fetched (e.g. the
 * host doesn't allow CORS), opens the URL in a new tab instead. A failed
 * format conversion falls back to the original file. Both warn the user.
 */
export const downloadFile = async (
  url: string,
  options: DownloadFileOptions = {},
) => {
  const blob = await fetchBlob(url);

  const { format } = options;

  if (!blob) {
    if (format) {
      enqueueSnackbar(FORMAT_UNAVAILABLE_MESSAGE, { variant: 'warning' });
    }

    window.open(url, '_blank', 'noopener');
    return;
  }

  let file = blob;

  if (format) {
    try {
      file = await convertImageBlob(blob, format);
    } catch {
      enqueueSnackbar(CONVERSION_FAILED_MESSAGE, { variant: 'warning' });
    }
  }

  downloadBlob(file, resolveFileName(url, file.type, options));
};
