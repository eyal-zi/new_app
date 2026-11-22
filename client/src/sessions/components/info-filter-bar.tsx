import { MenuItem } from '@mui/material';
import type { ChangeEvent } from 'react';

import { useGetFilterSchema } from '@/api/generated/api';

import { INFO_FILTER_VARIATIONS } from '../consts';
import type { InfoFilter, InfoVariationId } from '../types';
import { SEARCH_MAX_LENGTH } from './column-filter-cell.consts';
import { Bar, BarSelect, BarValue } from './info-filter-bar.styles';

// Filters the sessions by one property of a variation's info. The properties
// come from the API, so new ones show up without client changes.
export const InfoFilterBar = ({
  filter,
  onChange,
}: {
  filter: InfoFilter;
  onChange: (filter: InfoFilter) => void;
}) => {
  const { data: properties } = useGetFilterSchema({
    query: { staleTime: Infinity },
  });

  const first = properties?.[0];

  if (!first) {
    return null;
  }

  const property =
    properties.find(({ name }) => name === filter.property) ?? first;

  const changeVariation = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...filter, variation: event.target.value as InfoVariationId });

  const changeProperty = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...filter, property: event.target.value });

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
