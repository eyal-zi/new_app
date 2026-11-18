import {
  COMPLETED_STATUS,
  MAX_PROGRESS,
  MOCK_DEFAULT_STATISTIC,
  MOCK_EVALUATED_IMAGE_SIZE_PX,
  MOCK_IMAGE_BASE_URL,
  MOCK_RESULT_FILE_SIZE_PX,
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
      const requested = statistics?.length
        ? statistics
        : [MOCK_DEFAULT_STATISTIC];

      // Every other statistic yields files instead of scores, so both result
      // types show up in the mock data.
      const result = (
        statistic: string,
        key: string,
        asFile: boolean,
      ): SessionRecommendationResult =>
        asFile
          ? {
              variationa: mockImage(
                `${id}-${statistic}${key}-a`,
                MOCK_RESULT_FILE_SIZE_PX,
              ),
              variationb: mockImage(
                `${id}-${statistic}${key}-b`,
                MOCK_RESULT_FILE_SIZE_PX,
              ),
              type: 'file',
            }
          : {
              variationa: mockScore(),
              variationb: mockScore(),
              type: 'score',
            };

      return {
        ...base,
        recommendations: requested.map((statistic, index) => ({
          session_id: id,
          statistic,
          results: Object.fromEntries(
            MOCK_RESULT_KEYS.map((key) => [
              key,
              result(statistic, key, index % 2 === 1),
            ]),
          ),
          status: COMPLETED_STATUS,
        })),
      };
    }

    case 'training':
      return base;
  }
};
