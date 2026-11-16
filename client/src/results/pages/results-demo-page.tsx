import { useMockResults } from '../hooks/use-mock-results';
import { ResultsPage } from './results-page';

export const ResultsDemoPage = () => <ResultsPage data={useMockResults()} />;
