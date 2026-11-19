import {
  SCORE_COLOR_LIGHTNESS,
  SCORE_COLOR_SATURATION,
  SCORE_GREEN_HUE,
  SCORE_MAX,
  SCORE_MIN,
} from '../consts';

export const clampScore = (score: number) =>
  Number.isFinite(score) ? Math.min(SCORE_MAX, Math.max(SCORE_MIN, score)) : 0;

/** Green for a score of 0, through yellow, to red for a score of 1. */
export const getScoreColor = (score: number) =>
  `hsl(${Math.round((SCORE_MAX - clampScore(score)) * SCORE_GREEN_HUE)}, ${SCORE_COLOR_SATURATION}%, ${SCORE_COLOR_LIGHTNESS}%)`;
