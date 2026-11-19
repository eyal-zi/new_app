import { COMPARE_MAX_SINGLE_ROW } from '../consts';

/** Up to 3 images share one row; more wrap into a roughly square grid. */
export const getCompareColumns = (count: number) =>
  count <= COMPARE_MAX_SINGLE_ROW ? count : Math.ceil(Math.sqrt(count));
