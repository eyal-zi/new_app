import { Fragment } from 'react';

import { EMPTY_CELL_LABEL } from '../consts';
import type { GridCell, SelectedImage, SelectionGridRow } from '../types';
import { ScoreCell } from './score-cell';
import { SelectableImage } from './selectable-image';
import {
  ColumnTitle,
  EmptyCell,
  GridRoot,
  RowTitle,
} from './selection-grid.styles';

type SelectionGridProps = {
  selectionId: string;
  columnTitles: readonly string[];
  rows: readonly SelectionGridRow[];
  selectedIds: ReadonlySet<string>;
  onToggleImage: (image: SelectedImage) => void;
};

export const SelectionGrid = ({
  selectionId,
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

  const renderCell = (row: SelectionGridRow, cell: GridCell, index: number) => {
    const id = `${selectionId}:${row.id}:${index}`;

    if (cell.type === 'empty') {
      return <EmptyCell key={id}>{EMPTY_CELL_LABEL}</EmptyCell>;
    }

    if (cell.type === 'score') {
      return <ScoreCell key={id} score={cell.score} />;
    }

    const image: SelectedImage = {
      id,
      src: cell.url,
      label: `${row.title} - ${columnTitles[index]}`,
    };

    return (
      <SelectableImage
        key={id}
        image={image}
        selected={selectedIds.has(id)}
        onToggle={onToggleImage}
      />
    );
  };

  const renderRow = (row: SelectionGridRow) => (
    <Fragment key={row.id}>
      <RowTitle variant="body2">{row.title}</RowTitle>
      {row.cells.map((cell, index) => renderCell(row, cell, index))}
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
