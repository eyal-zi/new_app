import { Stack } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

import { COMPARE_PANEL_MAX_WIDTH, COMPARE_ROW_GAP } from '../consts';

const rowStyles = ({ theme }: { theme: Theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(COMPARE_ROW_GAP),
});
export const Row = styled(Stack)(rowStyles);

const iconWrapperStyles = ({ theme }: { theme: Theme }) => ({
  display: 'flex',
  color: (theme.vars ?? theme).palette.text.secondary,
});
export const IconWrapper = styled('div')(iconWrapperStyles);

const panelStyles = ({ theme }: { theme: Theme }) => ({
  flex: 1,
  minWidth: 0,
  textAlign: 'center' as const,
  maxWidth: theme.spacing(COMPARE_PANEL_MAX_WIDTH),
});
export const Panel = styled('div')(panelStyles);
