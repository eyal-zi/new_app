import { useEffect, useState } from 'react';

import { MOCK_PROGRESS_STEP, MOCK_SET_TITLES, MOCK_TICK_MS } from '../consts';
import type { ResultsData, ResultSet } from '../types';

const MAX_PROGRESS = 100;

const imageUrl = (seed: string) => `https://picsum.photos/seed/${seed}/600/400`;

const buildSet = (title: string, index: number, ready: boolean): ResultSet =>
  ready
    ? {
        id: `set-${index}`,
        title,
        status: 'ready',
        imageAUrl: imageUrl(`a-${index}`),
        imageBUrl: imageUrl(`b-${index}`),
      }
    : { id: `set-${index}`, title, status: 'loading' };

/**
 * Simulates the results lifecycle: progress ticks up, then the sets become
 * ready one by one. Replace with the real data once the endpoint exists.
 */
export const useMockResults = (): ResultsData => {
  const [tick, setTick] = useState(0);
  const total = MAX_PROGRESS / MOCK_PROGRESS_STEP + MOCK_SET_TITLES.length;

  useEffect(() => {
    if (tick >= total) {
      return;
    }

    const timer = setTimeout(() => setTick(tick + 1), MOCK_TICK_MS);

    return () => clearTimeout(timer);
  }, [tick, total]);

  const progressTicks = MAX_PROGRESS / MOCK_PROGRESS_STEP;

  if (tick < progressTicks) {
    return { status: 'in_progress', progress: tick * MOCK_PROGRESS_STEP };
  }

  const readyCount = tick - progressTicks;

  return {
    status: 'ready',
    sets: MOCK_SET_TITLES.map((title, index) =>
      buildSet(title, index, index < readyCount),
    ),
  };
};
