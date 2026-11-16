export type ResultSet =
  | { id: string; title: string; status: 'loading' }
  | {
      id: string;
      title: string;
      status: 'ready';
      imageAUrl: string;
      imageBUrl: string;
    };

export type ResultsData =
  | {
      status: 'in_progress';
      /** 0-100, or null when the progress is not known yet. */
      progress: number | null;
    }
  | { status: 'ready'; sets: readonly ResultSet[] };

export type ResultImage = { id: 'a' | 'b'; src: string; alt: string };

export type SelectionGridRow = {
  id: string;
  title: string;
  /** One image url per grid column, in column order. */
  imageUrls: readonly string[];
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
  | { status: 'in_progress'; progress: number | null }
  | { status: 'ready'; selections: readonly ResultSelection[] };

export type SelectedImage = { id: string; src: string; label: string };
