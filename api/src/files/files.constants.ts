export const IMAGE_TYPES = ['jpeg', 'png', 'gif', 'webp'] as const;

export type ImageType = (typeof IMAGE_TYPES)[number];

export const IMAGE_EXTENSIONS: Record<ImageType, string> = {
  jpeg: 'jpg',
  png: 'png',
  gif: 'gif',
  webp: 'webp',
};

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const UPLOADS_URL_PREFIX = 'api/uploads';
export const DEFAULT_UPLOADS_DIR = 'uploads';
