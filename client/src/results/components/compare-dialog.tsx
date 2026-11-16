import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Typography } from '@mui/material';

import { COMPARE_CLOSE_LABEL } from '../consts';
import type { SelectedImage } from '../types';
import { getCompareColumns } from '../utils/get-compare-columns';
import {
  CompareDialogRoot,
  CompareGrid,
  CompareHeader,
} from './compare-dialog.styles';
import { ComparePane } from './compare-pane';

type CompareDialogProps = {
  open: boolean;
  images: readonly SelectedImage[];
  onClose: () => void;
};

const renderPane = (image: SelectedImage) => (
  <ComparePane key={image.id} image={image} />
);

export const CompareDialog = ({
  open,
  images,
  onClose,
}: CompareDialogProps) => (
  <CompareDialogRoot fullScreen open={open} onClose={onClose}>
    <CompareHeader>
      <Typography variant="h6">Comparing {images.length} images</Typography>
      <IconButton aria-label={COMPARE_CLOSE_LABEL} onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </CompareHeader>
    <CompareGrid columns={getCompareColumns(images.length)}>
      {images.map(renderPane)}
    </CompareGrid>
  </CompareDialogRoot>
);
