import { randomUUID } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

import {
  BadRequestException,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ENV_KEYS } from '../envKeys.constants.js';
import {
  DEFAULT_UPLOADS_DIR,
  IMAGE_EXTENSIONS,
  type ImageType,
  UPLOADS_URL_PREFIX,
} from './files.constants.js';
import { detectImageType } from './image-type.js';

export interface UploadedImage {
  buffer: Buffer;
}

export interface ImageUpload {
  field: string;
  file: UploadedImage | undefined;
  allowed: readonly ImageType[];
}

@Injectable()
export class FilesService {
  readonly uploadsDir: string;

  private readonly publicUrl: string;

  constructor(config: ConfigService) {
    this.uploadsDir = resolve(
      config.get<string>(ENV_KEYS.UPLOADS_DIR) ?? DEFAULT_UPLOADS_DIR,
    );
    this.publicUrl = (
      config.get<string>(ENV_KEYS.API_PUBLIC_URL) ??
      `http://localhost:${config.getOrThrow<number>(ENV_KEYS.PORT)}`
    ).replace(/\/$/, '');
  }

  // Validates every upload before writing any, so a bad second file doesn't
  // leave the first one orphaned on disk. Returns the public URLs in order.
  async saveImages(uploads: ImageUpload[]): Promise<string[]> {
    const checked = uploads.map(({ field, file, allowed }) => {
      if (!file?.buffer.length) {
        throw new BadRequestException(`${field} is required`);
      }

      const type = detectImageType(file.buffer);

      if (!type || !allowed.includes(type)) {
        throw new UnsupportedMediaTypeException(
          `${field} must be an image of type: ${allowed.join(', ')}`,
        );
      }

      return { file, type };
    });

    await mkdir(this.uploadsDir, { recursive: true });

    return Promise.all(
      checked.map(async ({ file, type }) => {
        const name = `${randomUUID()}.${IMAGE_EXTENSIONS[type]}`;
        await writeFile(join(this.uploadsDir, name), file.buffer);

        return `${this.publicUrl}/${UPLOADS_URL_PREFIX}/${name}`;
      }),
    );
  }

  // Best-effort cleanup for files whose session could not be created.
  async deleteByUrls(urls: string[]) {
    await Promise.all(
      urls.map((url) =>
        rm(join(this.uploadsDir, basename(url)), { force: true }),
      ),
    );
  }
}
