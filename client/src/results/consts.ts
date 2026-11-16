export const RESULT_IMAGE_LABELS = { a: 'Image A', b: 'Image B' } as const;

export const RESULT_COLUMNS = 2;
export const SKELETON_TILE_COUNT = RESULT_COLUMNS;
/** In theme spacing units. */
export const SKELETON_TILE_HEIGHT = 25;
export const PROGRESS_MAX_WIDTH = 480;

export const RESULTS_PATH = '/results';

// Mock data simulation (remove once the results endpoint exists).
export const MOCK_TICK_MS = 600;
export const MOCK_PROGRESS_STEP = 10;
export const MOCK_SET_TITLES = [
  'Front view',
  'Side view',
  'Top view',
  'Close-up',
] as const;

export const RESULTS_CONTENT_MAX_WIDTH = 1000;

export const RESULTS_B_PATH = '/results-b';

export const SELECTION_GRID_ROW_TITLE_WIDTH = 14;
/** In theme spacing units. */
export const SELECTION_SKELETON_HEIGHT = 20;

// Mock data (remove once the results endpoint exists).
export const MOCK_SELECTION_TITLES = [
  'Selection 1',
  'Selection 2',
  'Selection 3',
] as const;
export const MOCK_GRID_COLUMN_TITLES = ['Image A', 'Image B'] as const;
export const MOCK_GRID_ROW_TITLES = [
  'Front view',
  'Side view',
  'Top view',
] as const;

export const COMPARE_MIN_IMAGES = 2;
export const COMPARE_HINT = 'Select at least 2 images to compare';
export const COMPARE_CLOSE_LABEL = 'Close comparison';

/** Shape of each cell in the selection grid. */
export const SELECTABLE_IMAGE_ASPECT_RATIO = '1 / 1';
