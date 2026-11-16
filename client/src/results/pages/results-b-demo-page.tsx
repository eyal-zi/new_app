import { useMockSelectionResults } from '../hooks/use-mock-selection-results';
import { ResultsBPage } from './results-b-page';

export const ResultsBDemoPage = () => (
  <ResultsBPage data={useMockSelectionResults()} />
);
