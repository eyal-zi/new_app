import { useEffect, useState } from 'react';

import {
  MOCK_GRID_COLUMN_TITLES,
  MOCK_GRID_ROW_TITLES,
  MOCK_PROGRESS_STEP,
  MOCK_SELECTION_TITLES,
  MOCK_TICK_MS,
} from '../consts';
import type { ResultSelection, SelectionResultsData } from '../types';

const MAX_PROGRESS = 100;
const PROGRESS_TICKS = MAX_PROGRESS / MOCK_PROGRESS_STEP;
const TOTAL_TICKS = PROGRESS_TICKS + MOCK_SELECTION_TITLES.length;

const imageUrl = (seed: string) => `https://picsum.photos/seed/${seed}/600/400`;

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
        columnTitles: MOCK_GRID_COLUMN_TITLES,
        rows: MOCK_GRID_ROW_TITLES.map((rowTitle, rowIndex) => ({
          id: `row-${rowIndex}`,
          title: rowTitle,
          imageUrls: MOCK_GRID_COLUMN_TITLES.map((_, colIndex) =>
            imageUrl(`s${index}-r${rowIndex}-c${colIndex}`),
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
    selections: MOCK_SELECTION_TITLES.map((title, index) =>
      buildSelection(title, index, index < readyCount),
    ),
  };
};
