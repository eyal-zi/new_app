import { Dialog } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CompareDialogRoot = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: (theme.vars ?? theme).palette.background.default,
  },
}));

export const CompareHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
}));

export const CompareGrid = styled('div', {
  shouldForwardProp: (prop) => prop !== 'columns',
})<{ columns: number }>(({ theme, columns }) => ({
  flex: 1,
  minHeight: 0,
  display: 'grid',
  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
  gridAutoRows: 'minmax(0, 1fr)',
  gap: theme.spacing(1),
  padding: theme.spacing(0, 2, 2),
}));
