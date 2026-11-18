import 'dotenv/config';

import { randomUUID } from 'node:crypto';

import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { ENV_KEYS } from './envKeys.constants.js';
import {
  RECOMMENDATION_RESULT_TYPES,
  SESSION_STATUSES,
  SESSION_TYPES,
} from './sessions/sessions.constants.js';
import { sessions } from './sessions/sessions.schema.js';

const SESSION_COUNT = 500;
const INSERT_BATCH_SIZE = 100;
const MAX_AGE_DAYS = 90;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const NULL_PROGRESS_CHANCE = 0.25;
const IMAGE_SIZES_PX: readonly (readonly [number, number])[] = [
  [40, 40],
  [80, 80],
  [120, 80],
  [80, 160],
  [200, 120],
  [320, 240],
  [64, 256],
  [400, 400],
];
const TRAINING_TYPES = ['fine_tune', 'full', 'lora'];
const RESULT_KEYS = ['_front_view', '_side_view', '_top_view'];
const STATISTICS = ['accuracy', 'precision', 'recall', 'f1', 'latency'];
const SCORE_DECIMALS = 2;
const NULL_VARIATION_INFO_CHANCE = 0.3;
const NULL_TRAINING_TYPE_CHANCE = 0.2;
const NULL_EVALUATED_IMAGE_CHANCE = 0.3;
const RANDOM_SEED = 20260101;
const OWNERS = [
  'alice',
  'bob',
  'carol',
  'dave',
  'erin',
  'frank',
  'grace',
  'heidi',
];

// Deterministic PRNG so every seed run produces the same data shape.
const createRandom = (seed: number) => {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const random = createRandom(RANDOM_SEED);
const pick = <T>(items: readonly T[]) =>
  items[Math.floor(random() * items.length)] as T;
const between = (min: number, max: number) =>
  min + Math.floor(random() * (max - min + 1));

const progressFor = (status: (typeof SESSION_STATUSES)[number]) => {
  switch (status) {
    case 'pending':
      return 0;
    case 'completed':
      return 100;
    default:
      return between(1, 99);
  }
};

const imageUrl = (seed: string) => {
  const [width, height] = pick(IMAGE_SIZES_PX);

  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
};

const variationInfo = (name: string) =>
  random() < NULL_VARIATION_INFO_CHANCE
    ? null
    : { name, model_version: `v${between(1, 5)}`, seed: between(0, 9999) };

const createTypeSpecificFields = (
  type: (typeof SESSION_TYPES)[number],
  id: string,
  status: (typeof SESSION_STATUSES)[number],
  index: number,
) => {
  switch (type) {
    case 'inference': {
      const resultType = pick(RECOMMENDATION_RESULT_TYPES);
      const result = (variation: string, key: string) =>
        resultType === 'score'
          ? random().toFixed(SCORE_DECIMALS)
          : `https://picsum.photos/seed/session-${index}-${variation}${key}-result/200/200`;
      const statistics = STATISTICS.slice(0, between(1, STATISTICS.length));

      return {
        recommendations: {
          session_id: id,
          statistic: statistics[0] as string,
          results: Object.fromEntries(
            RESULT_KEYS.map((key) => [
              key,
              {
                variationa: result('a', key),
                variationb: result('b', key),
                type: resultType,
              },
            ]),
          ),
          status,
        },
        statistics,
      };
    }

    case 'training':
      return {
        trainingType:
          random() < NULL_TRAINING_TYPE_CHANCE ? null : pick(TRAINING_TYPES),
        s8Link: `https://s8.example.com/training/${id}`,
      };
    case 'evaluation':
      return {
        evaluatedImageUrl:
          random() < NULL_EVALUATED_IMAGE_CHANCE
            ? null
            : imageUrl(`session-${index}-evaluated`),
      };
  }
};

const createMockSession = (index: number) => {
  const now = Date.now();
  const createdAt = new Date(now - random() * MAX_AGE_DAYS * MS_PER_DAY);
  const updatedAt = new Date(
    createdAt.getTime() + random() * (now - createdAt.getTime()),
  );
  const status = pick(SESSION_STATUSES);
  const type = pick(SESSION_TYPES);
  const id = randomUUID();

  return {
    id,
    type,
    owner: pick(OWNERS),
    imageAUrl: imageUrl(`session-${index}-a`),
    imageBUrl: imageUrl(`session-${index}-b`),
    createdAt,
    updatedAt,
    progress: random() < NULL_PROGRESS_CHANCE ? null : progressFor(status),
    status,
    notes: '',
    logs: status === 'failed' ? 'Session failed unexpectedly' : null,
    variationaInfo: variationInfo('variation a'),
    variationbInfo: variationInfo('variation b'),
    ...createTypeSpecificFields(type, id, status, index),
  };
};

const pool = new Pool({
  connectionString: process.env[ENV_KEYS.DATABASE_URL],
});
const db = drizzle(pool);

try {
  const reset = process.argv.includes('--reset');
  const [{ existing } = { existing: 0 }] = await db
    .select({ existing: sql<number>`count(*)::int` })
    .from(sessions);

  if (existing > 0 && !reset) {
    console.log(
      `sessions already has ${existing} rows; use --reset to replace them`,
    );
  } else {
    if (reset) {
      await db.delete(sessions);
    }

    const rows = Array.from({ length: SESSION_COUNT }, (_, i) =>
      createMockSession(i),
    );

    for (let i = 0; i < rows.length; i += INSERT_BATCH_SIZE) {
      await db.insert(sessions).values(rows.slice(i, i + INSERT_BATCH_SIZE));
    }

    console.log(`Inserted ${rows.length} mock sessions`);
  }
} finally {
  await pool.end();
}
