import { LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

import { PROGRESS_MAX_WIDTH } from '../consts';

export const ResultsProgressRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  maxWidth: PROGRESS_MAX_WIDTH,
  padding: theme.spacing(4, 0),
}));

export const ProgressBar = styled(LinearProgress)({ width: '100%' });
