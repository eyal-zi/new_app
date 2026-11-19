import { SESSION_IDS_PARAM, SESSION_IDS_SEPARATOR } from '../consts';

export type ResultsSearch = { [SESSION_IDS_PARAM]: string[] };

const toText = (raw: unknown) => {
  if (Array.isArray(raw)) {
    return raw.join(SESSION_IDS_SEPARATOR);
  }

  return typeof raw === 'string' || typeof raw === 'number' ? `${raw}` : '';
};

/**
 * Splits `ids=a,b,c` into unique, non-empty ids. Idempotent: the router runs
 * validation again on its own output, so an already-split array is accepted.
 * A lone numeric id arrives as a number, so numbers are accepted too.
 */
export const validateResultsSearch = (
  search: Record<string, unknown>,
): ResultsSearch => {
  const ids = toText(search[SESSION_IDS_PARAM])
    .split(SESSION_IDS_SEPARATOR)
    .map((id) => id.trim())
    .filter(Boolean);

  return { [SESSION_IDS_PARAM]: [...new Set(ids)] };
};
