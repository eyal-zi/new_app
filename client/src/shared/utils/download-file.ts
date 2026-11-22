import {
  DEFAULT_DOWNLOAD_FILE_NAME,
  type ImageDownloadFormat,
} from '@/shared/constants';

import { convertImageBlob } from './convert-image';

export type DownloadFileOptions = {
  /** Name to save the file as. Defaults to the file name in the URL. */
  fileName?: string;
  /** Used when there's no `fileName` and the URL has no file name. */
  fallbackName?: string;
  /** Converts the image to this format first; its extension replaces any existing one. */
  format?: ImageDownloadFormat;
};

const NON_FILE_NAME_CHARS = /[^a-z0-9. -]+/gi;
const EDGE_SEPARATORS = /^[\s-]+|[\s-]+$/g;

/** Keeps letters, digits, dots, spaces and dashes, so `id - name` stays readable. */
const toFileName = (text: string) =>
  text.replace(NON_FILE_NAME_CHARS, '-').replace(EDGE_SEPARATORS, '');

const hasExtension = (name: string) => name.includes('.');
const EXTENSION = /\.[^.]+$/;

const getUrlFileName = (url: string) => {
  const lastSegment = new URL(url, window.location.href).pathname
    .split('/')
    .pop();

  return lastSegment && hasExtension(lastSegment)
    ? decodeURIComponent(lastSegment)
    : undefined;
};

const withExtension = (name: string, mimeType: string) => {
  const extension = mimeType.split('/')[1]?.split(/[+;]/)[0];

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
  const baseName = format ? name.replace(EXTENSION, '') : name;

  return withExtension(baseName || DEFAULT_DOWNLOAD_FILE_NAME, mimeType);
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
 * host doesn't allow CORS), opens the URL in a new tab instead.
 */
export const downloadFile = async (
  url: string,
  options: DownloadFileOptions = {},
) => {
  const blob = await fetchBlob(url);

  if (!blob) {
    window.open(url, '_blank', 'noopener');
    return;
  }

  const { format } = options;
  const file = format ? await convertImageBlob(blob, format) : blob;

  downloadBlob(file, resolveFileName(url, file.type, options));
};
