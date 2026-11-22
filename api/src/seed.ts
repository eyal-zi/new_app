import 'dotenv/config';

import { randomUUID } from 'node:crypto';

import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { ENV_KEYS } from './envKeys.constants.js';
import {
  COMPLETED_STATUS,
  INITIAL_PROGRESS,
  MAX_PROGRESS,
  SESSION_STATUSES,
  SESSION_TYPES,
} from './sessions/sessions.constants.js';
import { buildMockResults } from './sessions/sessions.mock.js';
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
const STATISTICS = ['tomato', 'pineapple', 'mango', 'banana', 'cucumber'];
const PROGRESS_DECIMALS = 2;
const NULL_VARIATION_INFO_CHANCE = 0.3;
const NULL_TRAINING_TYPE_CHANCE = 0.2;
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
    case 'running':
      return INITIAL_PROGRESS;
    case 'completed':
      return MAX_PROGRESS;
    default:
      return +(
        INITIAL_PROGRESS +
        random() * (MAX_PROGRESS - INITIAL_PROGRESS)
      ).toFixed(PROGRESS_DECIMALS);
  }
};

const imageUrl = (seed: string) => {
  const [width, height] = pick(IMAGE_SIZES_PX);

  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
};

const variationInfo = (name: string) =>
  random() < NULL_VARIATION_INFO_CHANCE
    ? null
    : { name, model_version: `v${between(1, 5)}` };

// Results exist only for completed sessions, built by the same generator the
// mock worker uses, so seeded and freshly created sessions look alike.
const createTypeSpecificFields = (
  type: (typeof SESSION_TYPES)[number],
  id: string,
  status: (typeof SESSION_STATUSES)[number],
) => {
  switch (type) {
    case 'inference': {
      const statistics = STATISTICS.slice(0, between(1, STATISTICS.length));

      return {
        statistics,
        ...(status === COMPLETED_STATUS
          ? buildMockResults(type, id, statistics)
          : {}),
      };
    }

    case 'training':
      return {
        trainingType:
          random() < NULL_TRAINING_TYPE_CHANCE ? null : pick(TRAINING_TYPES),
        s8Link: `https://s8.example.com/training/${id}`,
      };
    case 'evaluation':
      return status === COMPLETED_STATUS ? buildMockResults(type, id) : {};
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
    ...createTypeSpecificFields(type, id, status),
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
