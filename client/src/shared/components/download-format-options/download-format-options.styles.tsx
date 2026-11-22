import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FormatOptions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const FormatButton = styled(Button)({
  minWidth: 0,
  color: 'inherit',
});
