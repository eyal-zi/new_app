import {
  IMAGE_DOWNLOAD_FORMATS,
  type ImageDownloadFormat,
} from '@/shared/constants';

const getMimeType = (format: ImageDownloadFormat) =>
  IMAGE_DOWNLOAD_FORMATS.find((option) => option.format === format)!.mimeType;

const readAsDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = src;
  });

const toCanvasBlob = (canvas: HTMLCanvasElement, mimeType: string) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Encoding failed'))),
      mimeType,
    );
  });

const toSvgBlob = (dataUrl: string, width: number, height: number) =>
  new Blob(
    [
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image width="${width}" height="${height}" xlink:href="${dataUrl}"/></svg>`,
    ],
    { type: getMimeType('svg') },
  );

/**
 * Re-encodes an image blob. SVG output wraps the pixels in an SVG (it doesn't
 * vectorize); a source that is already in the target format is returned as is.
 */
export const convertImageBlob = async (
  blob: Blob,
  format: ImageDownloadFormat,
) => {
  const mimeType = getMimeType(format);

  if (blob.type === mimeType) {
    return blob;
  }

  const dataUrl = await readAsDataUrl(blob);
  const image = await loadImage(dataUrl);
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;

  if (format === 'svg') {
    return toSvgBlob(dataUrl, width, height);
  }

  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d')!;

  context.drawImage(image, 0, 0);

  return toCanvasBlob(canvas, mimeType);
};
