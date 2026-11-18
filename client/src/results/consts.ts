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

/** Result fields shown as grid rows; titled by capitalizing the field name. */
export const VARIATION_KEYS = ['variationa', 'variationb'] as const;

export const RESULTS_B_PATH = '/results-b';

export const SELECTION_GRID_ROW_TITLE_WIDTH = 14;
/** In theme spacing units. */
export const SELECTION_SKELETON_HEIGHT = 20;

// Mock data (remove once the results endpoint exists).
/** Each selection is titled with its `statistic` value. */
export const MOCK_STATISTICS = ['statA', 'statB', 'statC'] as const;
/** Result keys as the API returns them; formatted into titles on the client. */
export const MOCK_RESULT_KEYS = [
  '_front_view',
  '_side_view',
  '_top_view',
] as const;
export const MOCK_SCORE_COLUMN_INDEX = 2;

export const COMPARE_MIN_IMAGES = 2;
export const COMPARE_HINT = 'Select at least 2 images to compare';
export const COMPARE_CLOSE_LABEL = 'Close comparison';

/** Score ring: hue goes from green (0) to red (1); sizes in px. */
export const SCORE_GREEN_HUE = 120;
export const SCORE_RING_SIZE = 96;
export const SCORE_RING_THICKNESS = 5;
export const SCORE_RING_TRACK_OPACITY = 0.15;
export const SCORE_PERCENT = 100;
export const SCORE_DECIMALS = 2;

/** Shape of each cell in the selection grid. */
export const SELECTABLE_IMAGE_ASPECT_RATIO = '1 / 1';
