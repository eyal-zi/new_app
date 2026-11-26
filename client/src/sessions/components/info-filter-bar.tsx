import { MenuItem } from '@mui/material';
import type { ChangeEvent } from 'react';

import { useGetFilterSchema } from '@/api/generated/api';
import { ErrorState } from '@/shared/ui/states';

import { INFO_FILTER_VARIATIONS, SEARCH_MAX_LENGTH } from '../consts';
import type { InfoFilter, InfoSearchField } from '../types';
import {
  InfoFilterPanel,
  InfoFilterSelect,
  InfoFilterSelectSkeleton,
  InfoFilterValue,
  InfoFilterValueSkeleton,
} from './info-filter-bar.styles';

// Filters the sessions by one property of a variation's info. The properties
// come from the API, so new ones show up without client changes (on the next
// refetch of the schema).
export const InfoFilterBar = ({
  filter,
  onChange,
}: {
  filter: InfoFilter;
  onChange: (filter: InfoFilter) => void;
}) => {
  const { data: properties, isError, refetch } = useGetFilterSchema();

  if (isError && !properties) {
    return (
      <ErrorState
        message="Unable to load the info filters"
        retry={() => void refetch()}
      />
    );
  }

  // Holds the bar's place while loading, so the table doesn't jump when the
  // properties arrive. Laid out like the real fields, so it wraps with them.
  if (!properties) {
    return (
      <InfoFilterPanel>
        <InfoFilterSelectSkeleton variant="rounded" />
        <InfoFilterSelectSkeleton variant="rounded" />
        <InfoFilterValueSkeleton variant="rounded" />
      </InfoFilterPanel>
    );
  }

  const property =
    properties.find(({ name }) => name === filter.property) ?? properties[0];

  if (!property) {
    return null;
  }

  // The filter holds one variation, property and text, so changing what it
  // targets clears the text instead of silently re-pointing it.
  const changeVariation = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({
      ...filter,
      field: event.target.value as InfoSearchField,
      text: '',
    });

  const changeProperty = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...filter, property: event.target.value, text: '' });

  // Pins the shown property, so what the user sees is what gets filtered.
  const changeText = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...filter, property: property.name, text: event.target.value });

  return (
    <InfoFilterPanel>
      <InfoFilterSelect
        select
        size="small"
        label="Variation"
        value={filter.field}
        onChange={changeVariation}
      >
        {INFO_FILTER_VARIATIONS.map(({ field, label }) => (
          <MenuItem key={field} value={field}>
            {label}
          </MenuItem>
        ))}
      </InfoFilterSelect>
      <InfoFilterSelect
        select
        size="small"
        label="Property"
        value={property.name}
        onChange={changeProperty}
      >
        {properties.map(({ name, title }) => (
          <MenuItem key={name} value={name}>
            {title}
          </MenuItem>
        ))}
      </InfoFilterSelect>
      <InfoFilterValue
        size="small"
        label={property.title}
        placeholder="Filter"
        value={filter.text}
        onChange={changeText}
        slotProps={{ htmlInput: { maxLength: SEARCH_MAX_LENGTH } }}
      />
    </InfoFilterPanel>
  );
};
