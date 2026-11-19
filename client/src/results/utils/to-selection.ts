import type { RecommendationsDto } from '@/api/generated/model';

import { VARIATION_KEYS } from '../consts';
import type { ResultSelection } from '../types';
import { capitalize } from './capitalize';
import { formatResultKey } from './format-result-key';
import { toGridCell } from './to-grid-cell';

/** One selection per recommendation: titled by its statistic, one column per result key. */
export const toSelection = (
  recommendation: RecommendationsDto,
): ResultSelection => {
  const entries = Object.entries(recommendation.results);

  return {
    id: recommendation.statistic,
    title: recommendation.statistic,
    status: 'ready',
    columnTitles: entries.map(([key]) => formatResultKey(key)),
    rows: VARIATION_KEYS.map((variation) => ({
      id: variation,
      title: capitalize(variation),
      cells: entries.map(([, result]) =>
        toGridCell(result.type, result[variation] ?? null),
      ),
    })),
  };
};
