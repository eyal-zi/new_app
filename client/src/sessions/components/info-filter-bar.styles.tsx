import { Paper, Skeleton, TextField } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

import {
  INFO_FILTER_FIELD_HEIGHT,
  INFO_FILTER_SELECT_MIN_WIDTH,
  INFO_FILTER_VALUE_MIN_WIDTH,
} from './info-filter-bar.consts';

// Shared by each field and its loading skeleton, so both wrap alike.
const selectStyles = ({ theme }: { theme: Theme }) => ({
  minWidth: theme.spacing(INFO_FILTER_SELECT_MIN_WIDTH),
});

const valueStyles = ({ theme }: { theme: Theme }) => ({
  flex: 1,
  minWidth: theme.spacing(INFO_FILTER_VALUE_MIN_WIDTH),
});

export const InfoFilterPanel = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

export const InfoFilterSelect = styled(TextField)(selectStyles);

export const InfoFilterValue = styled(TextField)(valueStyles);

export const InfoFilterSelectSkeleton = styled(Skeleton)(
  selectStyles,
  ({ theme }) => ({ height: theme.spacing(INFO_FILTER_FIELD_HEIGHT) }),
);

export const InfoFilterValueSkeleton = styled(Skeleton)(
  valueStyles,
  ({ theme }) => ({ height: theme.spacing(INFO_FILTER_FIELD_HEIGHT) }),
);
