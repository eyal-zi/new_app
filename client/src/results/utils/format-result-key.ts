import { capitalize } from './capitalize';

/** Turns an API result key like `_this_is_key` into a column title: `This Is Key`. */
export const formatResultKey = (key: string) =>
  key.split('_').filter(Boolean).map(capitalize).join(' ');
