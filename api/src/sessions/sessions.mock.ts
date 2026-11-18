import {
  COMPLETED_STATUS,
  MAX_PROGRESS,
  MOCK_DEFAULT_STATISTIC,
  MOCK_EVALUATED_IMAGE_SIZE_PX,
  MOCK_IMAGE_BASE_URL,
  MOCK_RESULT_KEYS,
  MOCK_SCORE_DECIMALS,
  type SESSION_TYPES,
} from './sessions.constants.js';
import type {
  SessionRecommendationResult,
  sessions,
} from './sessions.schema.js';

const mockImage = (seed: string, size: number) =>
  `${MOCK_IMAGE_BASE_URL}/${seed}/${size}/${size}`;

const mockScore = () => Math.random().toFixed(MOCK_SCORE_DECIMALS);

// Generates the results a real worker would produce for a finished session.
export const buildMockResults = (
  type: (typeof SESSION_TYPES)[number],
  id: string,
  statistics?: string[] | null,
): Partial<typeof sessions.$inferInsert> => {
  const base = { status: COMPLETED_STATUS, progress: MAX_PROGRESS };

  switch (type) {
    case 'evaluation':
      return {
        ...base,
        evaluatedImageUrl: mockImage(
          `${id}-evaluated`,
          MOCK_EVALUATED_IMAGE_SIZE_PX,
        ),
      };

    case 'inference': {
      const result = (): SessionRecommendationResult => ({
        variationa: mockScore(),
        variationb: mockScore(),
        type: 'score',
      });

      return {
        ...base,
        recommendations: {
          session_id: id,
          statistic: statistics?.[0] ?? MOCK_DEFAULT_STATISTIC,
          results: Object.fromEntries(
            MOCK_RESULT_KEYS.map((key) => [key, result()]),
          ),
          status: COMPLETED_STATUS,
        },
      };
    }

    case 'training':
      return base;
  }
};
