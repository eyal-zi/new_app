export type ResultSet =
  | { id: string; title: string; status: 'loading' }
  /** Waiting to start: the only state in which it can still be canceled. */
  | { id: string; title: string; status: 'pending' }
  | {
      id: string;
      title: string;
      status: 'ready';
      imageAUrl: string;
      evaluatedImageUrl: string;
    };

export type ResultImage = { id: 'a' | 'evaluated'; src: string; alt: string };

/** A grid cell: an image when the statistic type is `file`, otherwise a 0-1 score. */
export type GridCell =
  { type: 'file'; url: string } | { type: 'score'; score: number };

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

export type SelectionResultsData =
  | {
      status: 'in_progress';
      /** 0-100, or null when the progress is not known yet. */
      progress: number | null;
    }
  | { status: 'ready'; selections: readonly ResultSelection[] };

export type SelectedImage = { id: string; src: string; label: string };
