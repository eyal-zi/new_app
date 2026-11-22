import type { GridCell } from '../types';

/**
 * Builds a grid cell from a statistic result value: an image url for `file`,
 * a number, or a numeric string, between 0 and 1 for `score`. A missing or
 * non-numeric value gives an `empty` cell, so it isn't shown as a real score
 * of 0.
 */
export const toGridCell = (
  type: 'file' | 'score',
  value: string | number | null,
): GridCell => {
  // Not `!value`: a numeric 0 is a real score.
  if (value === null || value === '') {
    return { type: 'empty' };
  }

  if (type === 'file') {
    return typeof value === 'string' ? { type, url: value } : { type: 'empty' };
  }

  const score = Number(value);

  return Number.isFinite(score) ? { type, score } : { type: 'empty' };
};
