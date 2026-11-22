import { INFO_FILTER_VARIATIONS } from '../consts';
import type { InfoFilter } from '../types';

// The search values for the info filter; none while it has no property or its
// text is blank.
export const getInfoSearchValues = ({
  variation,
  property,
  value,
}: InfoFilter) => {
  const text = value.trim();
  const config = INFO_FILTER_VARIATIONS.find(({ id }) => id === variation);

  return config && property && text
    ? { [config.field]: { [property]: text } }
    : {};
};
