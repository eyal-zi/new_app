import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SelectionBarRoot = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  left: '50%',
  transform: 'translateX(-50%)',
  // Keep below theme.zIndex.modal so dialogs (the compare view, the lightbox,
  // confirmations) always cover the bar. Don't raise it above that.
  zIndex: theme.zIndex.speedDial,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1, 2),
}));
