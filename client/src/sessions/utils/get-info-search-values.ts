import type { SessionSearchValuesDto } from '@/api/generated/model';

import type { InfoFilter, InfoSearchField } from '../types';

// The search values for the info filter; none while it has no property or its
// text is blank.
export const getInfoSearchValues = ({
  field,
  property,
  text,
}: InfoFilter): Pick<SessionSearchValuesDto, InfoSearchField> => {
  const trimmedText = text.trim();

  return property && trimmedText
    ? { [field]: { [property]: trimmedText } }
    : {};
};
