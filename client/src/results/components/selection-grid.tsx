import { Fragment } from 'react';

import type { SelectedImage, SelectionGridRow } from '../types';
import { SelectableImage } from './selectable-image';
import { ColumnTitle, GridRoot, RowTitle } from './selection-grid.styles';

type SelectionGridProps = {
  selectionId: string;
  selectionTitle: string;
  columnTitles: readonly string[];
  rows: readonly SelectionGridRow[];
  selectedIds: ReadonlySet<string>;
  onToggleImage: (image: SelectedImage) => void;
};

export const SelectionGrid = ({
  selectionId,
  selectionTitle,
  columnTitles,
  rows,
  selectedIds,
  onToggleImage,
}: SelectionGridProps) => {
  const renderColumnTitle = (title: string) => (
    <ColumnTitle key={title} variant="subtitle2">
      {title}
    </ColumnTitle>
  );

  const renderRow = (row: SelectionGridRow) => (
    <Fragment key={row.id}>
      <RowTitle variant="body2">{row.title}</RowTitle>
      {row.imageUrls.map((src, index) => {
        const id = `${selectionId}:${row.id}:${index}`;
        const image: SelectedImage = {
          id,
          src,
          label: `${selectionTitle} · ${row.title} · ${columnTitles[index]}`,
        };

        return (
          <SelectableImage
            key={id}
            image={image}
            selected={selectedIds.has(id)}
            onToggle={onToggleImage}
          />
        );
      })}
    </Fragment>
  );

  return (
    <GridRoot columns={columnTitles.length}>
      <span />
      {columnTitles.map(renderColumnTitle)}
      {rows.map(renderRow)}
    </GridRoot>
  );
};
