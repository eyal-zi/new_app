import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import { RESULTS_CONTENT_MAX_WIDTH } from '../consts';

export const ResultsContent = styled(Stack)(({ theme }) => ({
  width: '100%',
  maxWidth: RESULTS_CONTENT_MAX_WIDTH,
  alignSelf: 'center',
  padding: theme.spacing(0, 4),
}));
