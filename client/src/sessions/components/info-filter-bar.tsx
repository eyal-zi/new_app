import { MenuItem } from '@mui/material';
import type { ChangeEvent } from 'react';

import { useGetFilterSchema } from '@/api/generated/api';
import { ErrorState } from '@/shared/ui/states';

import { INFO_FILTER_VARIATIONS, SEARCH_MAX_LENGTH } from '../consts';
import type { InfoFilter, InfoVariationId } from '../types';
import {
  Bar,
  BarSelect,
  BarSkeleton,
  BarValue,
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

  // Holds the bar's place while loading, so the table doesn't jump when the
  // properties arrive.
  if (!properties) {
    return isError ? (
      <ErrorState
        message="Unable to load the info filters"
        retry={() => void refetch()}
      />
    ) : (
      <BarSkeleton variant="rounded" />
    );
  }

  const first = properties[0];

  if (!first) {
    return null;
  }

  const property =
    properties.find(({ name }) => name === filter.property) ?? first;

  // The filter holds one variation, property and text, so changing what it
  // targets clears the text instead of silently re-pointing it.
  const changeVariation = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({
      ...filter,
      variation: event.target.value as InfoVariationId,
      value: '',
    });

  const changeProperty = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...filter, property: event.target.value, value: '' });

  // Pins the shown property, so what the user sees is what gets filtered.
  const changeValue = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...filter, property: property.name, value: event.target.value });

  return (
    <Bar>
      <BarSelect
        select
        size="small"
        label="Variation"
        value={filter.variation}
        onChange={changeVariation}
      >
        {INFO_FILTER_VARIATIONS.map(({ id, label }) => (
          <MenuItem key={id} value={id}>
            {label}
          </MenuItem>
        ))}
      </BarSelect>
      <BarSelect
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
      </BarSelect>
      <BarValue
        size="small"
        label={property.title}
        placeholder="Filter"
        value={filter.value}
        onChange={changeValue}
        slotProps={{ htmlInput: { maxLength: SEARCH_MAX_LENGTH } }}
      />
    </Bar>
  );
};
