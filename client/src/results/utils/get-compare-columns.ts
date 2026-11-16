const MAX_SINGLE_ROW = 3;

/** Up to 3 images share one row; more wrap into a roughly square grid. */
export const getCompareColumns = (count: number) =>
  count <= MAX_SINGLE_ROW ? count : Math.ceil(Math.sqrt(count));
