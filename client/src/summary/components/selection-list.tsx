import { Typography } from '@mui/material';

import { SELECTIONS_TITLE } from '../consts';
import type { Selection } from '../types';
import { Chips, Section, SelectionChip } from './selection-list.styles';

export type SelectionListProps = {
  selections: readonly Selection[];
  /** Omit to make the selections read-only. */
  onRemove?: (id: string) => void;
};

// The last remaining selection can't be removed, so there is never a way to
// cancel all of them.
export const SelectionList = ({ selections, onRemove }: SelectionListProps) => {
  const isRemovable = !!onRemove && selections.length > 1;

  const renderChip = ({ id, label }: Selection) => (
    <SelectionChip
      key={id}
      label={label}
      onDelete={isRemovable ? () => onRemove?.(id) : undefined}
    />
  );

  return (
    <Section spacing={1}>
      <Typography variant="h6">{SELECTIONS_TITLE}</Typography>
      <Chips direction="row" aria-label={SELECTIONS_TITLE}>
        {selections.map(renderChip)}
      </Chips>
    </Section>
  );
};
