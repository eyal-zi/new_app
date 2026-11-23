import { styled } from '@mui/material/styles';

export const RunningSessionRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(6, 0),
}));
