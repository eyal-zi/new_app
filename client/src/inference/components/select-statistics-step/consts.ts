import { type ChoiceOption } from '@/shared/components/choice-group/types';

export const SELECT_STATISTICS_TITLE = 'Select required statistics';

/** In theme spacing units. */
export const CHOICES_MAX_WIDTH = 150;

/** Each value is sent to the API as a statistic name. */
export const STATISTICS = {
  a: 'a',
  b: 'b',
  c: 'c',
  d: 'd',
  e: 'e',
} as const;

export type Statistic = (typeof STATISTICS)[keyof typeof STATISTICS];

export const STATISTIC_OPTIONS: readonly (ChoiceOption<Statistic> & {
  label: string;
})[] = [
  { value: STATISTICS.a, label: 'A' },
  { value: STATISTICS.b, label: 'B' },
  { value: STATISTICS.c, label: 'C' },
  { value: STATISTICS.d, label: 'D' },
  { value: STATISTICS.e, label: 'E' },
];
