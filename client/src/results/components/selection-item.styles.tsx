import { Accordion } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SelectionAccordion = styled(Accordion)({
  '&::before': { display: 'none' },
});

export const SummaryContent = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));
