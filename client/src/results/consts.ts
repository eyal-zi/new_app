import { SessionStatus } from '@/api/generated/model';

/**
 * Session status flow: started -> running -> completed. From any step before
 * completed a session can also end as failed or canceled. A session that is
 * not in a terminal status is "in progress": the results pages show it as
 * loading, offer to cancel it and keep polling until it reaches one.
 */
export const TERMINAL_STATUSES: readonly SessionStatus[] = [
  SessionStatus.completed,
  SessionStatus.failed,
  SessionStatus.canceled,
];
/** Terminal statuses that produce no results. */
export const FAILED_STATUSES: readonly SessionStatus[] = [
  SessionStatus.failed,
  SessionStatus.canceled,
];

export const RESULT_IMAGE_LABELS = {
  a: 'original',
  evaluated: 'evaluated',
} as const;

export const RESULT_COLUMNS = 2;
export const SKELETON_TILE_COUNT = RESULT_COLUMNS;
/** In theme spacing units. */
export const SKELETON_TILE_HEIGHT = 25;
export const PROGRESS_MAX_WIDTH = 480;
export const PROGRESS_DECIMALS = 3;

export const RESULTS_CONTENT_MAX_WIDTH = 1000;

/** Result fields shown as grid rows; titled by capitalizing the field name. */
export const VARIATION_KEYS = ['variationa', 'variationb'] as const;

/** Shown in a grid cell whose result has no value. */
export const EMPTY_CELL_LABEL = '—';

export const SELECTION_GRID_ROW_TITLE_WIDTH = 14;
/** In px. */
export const SELECTION_LOADING_SPINNER_SIZE = 18;
/** Index into `theme.shadows`. */
export const SELECTION_BAR_ELEVATION = 6;
/** In theme spacing units. */
export const SELECTION_SKELETON_HEIGHT = 20;

/** Up to this many compared images share one row. */
export const COMPARE_MAX_SINGLE_ROW = 3;
export const COMPARE_MIN_IMAGES = 2;
export const COMPARE_HINT = 'Select at least 2 images to compare';
export const COMPARE_CLOSE_LABEL = 'Close comparison';

/** Score ring: hue goes from green (0) to red (1); sizes in px. */
export const SCORE_GREEN_HUE = 120;
export const SCORE_RING_SIZE = 96;
export const SCORE_RING_THICKNESS = 5;
export const SCORE_RING_TRACK_OPACITY = 0.15;
export const SCORE_MIN = 0;
export const SCORE_MAX = 1;
export const SCORE_COLOR_SATURATION = 75;
export const SCORE_COLOR_LIGHTNESS = 45;
export const SCORE_DECIMALS = 2;

/** Shape of each cell in the selection grid. */
export const SELECTABLE_IMAGE_ASPECT_RATIO = '1 / 1';

/** Search param listing the evaluation session ids to compare, comma-separated. */
export const SESSION_IDS_PARAM = 'ids';
export const SESSION_IDS_SEPARATOR = ',';

/** How often an in-progress session is re-fetched to see whether it has finished. */
export const ACTIVE_POLL_INTERVAL_MS = 3000;
export const RUNNING_MESSAGE = 'Your session is running…';
export const CANCEL_SESSION_LABEL = 'Cancel session';
export const SESSION_CANCELED_MESSAGE = 'Session canceled';

export const INFERENCE_RESULTS_TITLE = 'Inference results';
export const INFERENCE_RESULTS_SUBTITLE =
  'Expand a selection to compare its images. Ctrl/Cmd + click an image, or use its checkbox, to select it.';
export const EVALUATION_RESULTS_TITLE = 'Evaluation results';
export const EVALUATION_RESULTS_SUBTITLE =
  'Compare image A and the evaluated image for each session.';

export const getCompareTitle = (count: number) => `Comparing ${count} images`;
export const getSelectedCountLabel = (count: number) => `${count} selected`;
export const CLEAR_SELECTION_LABEL = 'Clear';
export const COMPARE_LABEL = 'Compare';

export const PROGRESS_LABEL = 'Results progress';
export const LOADING_LABEL = 'Loading';
export const getLoadingLabel = (title: string) => `Loading ${title}`;
export const getScoreLabel = (score: string) => `Score ${score}`;

export const NO_SESSIONS_MESSAGE = 'No sessions selected.';
export const LOAD_SESSION_ERROR_MESSAGE = "Couldn't load the session.";
export const INVALID_RESULTS_LINK_MESSAGE =
  'This session has an invalid results link.';
export const REDIRECTING_MESSAGE = 'Redirecting to the training results…';
export const getUnknownTypeMessage = (type: string) =>
  `Unknown session type "${type}".`;
export const getFailedSessionMessage = (description: string) =>
  `This session ${description}.`;
export const NO_INFERENCE_RESULTS_MESSAGE =
  'No results are available for this session.';
export const NO_EVALUATED_IMAGE_MESSAGE =
  'The evaluated image is not available for this session.';
export const getLoadProblem = (id: string) => `Couldn't load session ${id}.`;
export const getFailedProblem = (id: string, description: string) =>
  `Session ${id} ${description}.`;
export const getNoEvaluatedImageProblem = (id: string) =>
  `Session ${id} has no evaluated image.`;
