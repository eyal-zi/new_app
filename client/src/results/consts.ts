export const RESULT_IMAGE_LABELS = {
  a: 'Image A',
  evaluated: 'Evaluated image',
} as const;

export const RESULT_COLUMNS = 2;
export const SKELETON_TILE_COUNT = RESULT_COLUMNS;
/** In theme spacing units. */
export const SKELETON_TILE_HEIGHT = 25;
export const PROGRESS_MAX_WIDTH = 480;

export const RESULTS_CONTENT_MAX_WIDTH = 1000;

/** Result fields shown as grid rows; titled by capitalizing the field name. */
export const VARIATION_KEYS = ['variationa', 'variationb'] as const;

export const SELECTION_GRID_ROW_TITLE_WIDTH = 14;
/** In theme spacing units. */
export const SELECTION_SKELETON_HEIGHT = 20;

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

/** Search param listing the evaluation session ids to compare, comma-separated. */
export const SESSION_IDS_PARAM = 'ids';
export const SESSION_IDS_SEPARATOR = ',';

/** How often a running session is re-fetched to see whether it has started. */
export const RUNNING_POLL_INTERVAL_MS = 3000;
export const RUNNING_MESSAGE = 'Your session is running…';
export const CANCEL_SESSION_LABEL = 'Cancel session';
export const SESSION_CANCELED_MESSAGE = 'Session canceled';
