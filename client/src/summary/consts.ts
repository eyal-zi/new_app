import type { GalleryImage } from '@/shared/components/image-gallery/types';

export const SUMMARY_PATH = '/summary';

const IMAGE_COUNT = 12;
const IMAGE_SIZE = 1200;
const THUMBNAIL_SIZE = 400;

const getPlaceholderUrl = (seed: number, size: number) =>
  `https://picsum.photos/seed/summary-${seed}/${size}`;

export const SUMMARY_IMAGES: (GalleryImage & { id: string })[] = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => ({
    id: `summary-image-${i + 1}`,
    src: getPlaceholderUrl(i + 1, IMAGE_SIZE),
    thumbnailSrc: getPlaceholderUrl(i + 1, THUMBNAIL_SIZE),
    alt: `Summary image ${i + 1}`,
    caption: `Image ${i + 1}`,
  }),
);

export const SUMMARY_B_PATH = '/summary-b';

export const COMPARE_IMAGE_SIZE = 800;

export const COMPARE_IMAGES = {
  a: {
    title: 'A',
    src: `https://picsum.photos/seed/summary-a/${COMPARE_IMAGE_SIZE}`,
    alt: 'Image A',
    name: 'summary-a.jpg',
  },
  b: {
    title: 'B',
    src: `https://picsum.photos/seed/summary-b/${COMPARE_IMAGE_SIZE}`,
    alt: 'Image B',
    name: 'summary-b.jpg',
  },
};

// In theme spacing units (8px each).
export const COMPARE_PANEL_MAX_WIDTH = 40;
export const COMPARE_ROW_GAP = 6;

export const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB'];
export const FILE_SIZE_UNIT_STEP = 1024;
export const FILE_SIZE_FALLBACK = '—';

// Stand-in for the choices made on the previous page's multiple-choice list.
export const INITIAL_SELECTIONS = [
  { id: 'option-1', label: 'Option 1' },
  { id: 'option-2', label: 'Option 2' },
  { id: 'option-3', label: 'Option 3' },
  { id: 'option-4', label: 'Option 4' },
];

export const SELECTIONS_TITLE = 'Your selections';

export const SUMMARY_C_PATH = '/summary-c';

export const SINGLE_SELECTION = INITIAL_SELECTIONS.slice(0, 1);

/** Fixed number of images per row on the summary page. */
export const SUMMARY_GALLERY_COLUMNS = 4;
