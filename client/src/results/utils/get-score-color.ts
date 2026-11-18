import { SCORE_GREEN_HUE } from '../consts';

/** Green for a score of 0, through yellow, to red for a score of 1. */
export const getScoreColor = (score: number) =>
  `hsl(${Math.round((1 - clampScore(score)) * SCORE_GREEN_HUE)}, 75%, 45%)`;

export const clampScore = (score: number) =>
  Number.isFinite(score) ? Math.min(1, Math.max(0, score)) : 0;
