export type ResultSet =
  | { id: string; title: string; status: 'loading' }
  /** Not in a terminal status yet (started or running): it can still be canceled. */
  | { id: string; title: string; status: 'active' }
  | {
      id: string;
      title: string;
      status: 'ready';
      imageAUrl: string;
      evaluatedImageUrl: string;
    };

export type ResultImage = { id: 'a' | 'evaluated'; src: string; alt: string };

/**
 * A grid cell: an image when the statistic type is `file`, a 0-1 score when it
 * is `score`, and `empty` when the result has no usable value.
 */
export type GridCell =
  | { type: 'file'; url: string }
  | { type: 'score'; score: number }
  | { type: 'empty' };

export type SelectionGridRow = {
  id: string;
  title: string;
  /** One cell per grid column, in column order. */
  cells: readonly GridCell[];
};

export type ResultSelection =
  | { id: string; title: string; status: 'loading' }
  | {
      id: string;
      title: string;
      status: 'ready';
      columnTitles: readonly string[];
      rows: readonly SelectionGridRow[];
    };

export type SelectedImage = { id: string; src: string; label: string };
