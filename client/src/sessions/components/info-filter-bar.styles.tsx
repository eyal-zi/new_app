import { Paper, Skeleton, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  INFO_FILTER_BAR_HEIGHT_PX,
  INFO_FILTER_SELECT_MIN_WIDTH_PX,
  INFO_FILTER_VALUE_MIN_WIDTH_PX,
} from './info-filter-bar.consts';

export const Bar = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

export const BarSelect = styled(TextField)({
  minWidth: INFO_FILTER_SELECT_MIN_WIDTH_PX,
});

export const BarValue = styled(TextField)({
  flex: 1,
  minWidth: INFO_FILTER_VALUE_MIN_WIDTH_PX,
});

export const BarSkeleton = styled(Skeleton)({
  height: INFO_FILTER_BAR_HEIGHT_PX,
});
