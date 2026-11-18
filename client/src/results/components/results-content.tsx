import type { ReactNode } from 'react';

import { ResultsContentRoot } from './results-content.styles';

type ResultsContentProps = { spacing: number; children: ReactNode };

/** Centers the results at a readable width. */
export const ResultsContent = ({ spacing, children }: ResultsContentProps) => (
  <ResultsContentRoot spacing={spacing}>{children}</ResultsContentRoot>
);
