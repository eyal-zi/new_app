import type { GridCell } from '../types';

/**
 * Builds a grid cell from a statistic result value: an image url for `file`,
 * a numeric string between 0 and 1 for `score`.
 */
export const toGridCell = (
  type: 'file' | 'score',
  value: string | null,
): GridCell =>
  type === 'file' ? { type, url: value ?? '' } : { type, score: Number(value) };
