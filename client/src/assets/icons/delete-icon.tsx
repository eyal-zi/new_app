import MuiDeleteIcon from '@mui/icons-material/DeleteOutlineRounded';
import type { SvgIconProps } from '@mui/material';

// Named by meaning, not by its MUI source, so every delete action in the app
// shares one icon. Swap the source here to change it everywhere.
export const DeleteIcon = (props: SvgIconProps) => <MuiDeleteIcon {...props} />;
