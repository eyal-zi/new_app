import {
  doublePrecision,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { MAX_OWNER_LENGTH } from './sessions.constants.js';

/** Keys are the `name`s of SESSION_INFO_FILTERS. */
export type SessionInfo = Record<string, string>;
export type SessionRecommendationResult = {
  variationa: string | number | null;
  variationb: string | number | null;
  type: 'file' | 'score';
};
export type SessionRecommendations = {
  session_id: string;
  statistic: string;
  /** Keyed by column, formatted like `_this_is_key`. */
  results: Record<string, SessionRecommendationResult>;
  status: string;
};

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: varchar('type', { length: 32 }).notNull(),
    owner: varchar('owner', { length: MAX_OWNER_LENGTH }).notNull(),
    imageAUrl: text('image_a_url').notNull(),
    imageBUrl: text('image_b_url').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    // A fraction from 0 to 1.
    progress: doublePrecision('progress'),
    status: varchar('status', { length: 32 }).notNull().default('running'),
    notes: text('notes').notNull().default(''),
    logs: text('logs'),
    variationaInfo: jsonb('variationa_info').$type<SessionInfo>(),
    variationbInfo: jsonb('variationb_info').$type<SessionInfo>(),
    // Inference-only
    recommendations: jsonb('recommendations').$type<SessionRecommendations[]>(),
    statistics: jsonb('statistics').$type<string[]>(),
    // Training-only
    trainingType: text('training_type'),
    s8Link: text('s8_link'),
    // Evaluation-only
    evaluatedImageUrl: text('evaluated_image_url'),
  },
  (table) => [
    index('sessions_updated_at_idx').on(table.updatedAt.desc(), table.id),
    index('sessions_type_idx').on(table.type),
  ],
);
