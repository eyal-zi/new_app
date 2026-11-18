import { useEffect, useState } from 'react';

import {
  MOCK_PROGRESS_STEP,
  MOCK_RESULT_KEYS,
  MOCK_SCORE_COLUMN_INDEX,
  MOCK_STATISTICS,
  MOCK_TICK_MS,
  VARIATION_KEYS,
} from '../consts';
import type { ResultSelection, SelectionResultsData } from '../types';
import { capitalize } from '../utils/capitalize';
import { formatResultKey } from '../utils/format-result-key';

const MAX_PROGRESS = 100;
const PROGRESS_TICKS = MAX_PROGRESS / MOCK_PROGRESS_STEP;
const TOTAL_TICKS = PROGRESS_TICKS + MOCK_STATISTICS.length;

const imageUrl = (seed: string) => `https://picsum.photos/seed/${seed}/600/400`;

const MOCK_SCORES: readonly number[] = [0.05, 0.3, 0.55, 0.8, 0.97];

const mockScore = (selectionIndex: number, rowIndex: number) =>
  MOCK_SCORES[(selectionIndex * 2 + rowIndex) % MOCK_SCORES.length] ?? 0;

const buildSelection = (
  title: string,
  index: number,
  ready: boolean,
): ResultSelection =>
  ready
    ? {
        id: `selection-${index}`,
        title,
        status: 'ready',
        columnTitles: MOCK_RESULT_KEYS.map(formatResultKey),
        rows: VARIATION_KEYS.map((variation, rowIndex) => ({
          id: variation,
          title: capitalize(variation),
          cells: MOCK_RESULT_KEYS.map((_, colIndex) =>
            colIndex === MOCK_SCORE_COLUMN_INDEX
              ? { type: 'score', score: mockScore(index, rowIndex) }
              : {
                  type: 'file',
                  url: imageUrl(`s${index}-r${rowIndex}-c${colIndex}`),
                },
          ),
        })),
      }
    : { id: `selection-${index}`, title, status: 'loading' };

/** Simulates progress, then selections becoming ready one by one. */
export const useMockSelectionResults = (): SelectionResultsData => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (tick >= TOTAL_TICKS) {
      return;
    }

    const timer = setTimeout(() => setTick(tick + 1), MOCK_TICK_MS);

    return () => clearTimeout(timer);
  }, [tick]);

  if (tick < PROGRESS_TICKS) {
    return { status: 'in_progress', progress: tick * MOCK_PROGRESS_STEP };
  }

  const readyCount = tick - PROGRESS_TICKS;

  return {
    status: 'ready',
    selections: MOCK_STATISTICS.map((statistic, index) =>
      buildSelection(statistic, index, index < readyCount),
    ),
  };
};
