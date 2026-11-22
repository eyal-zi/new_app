import MuiCancelIcon from '@mui/icons-material/Cancel';
import type { SvgIconProps } from '@mui/material';

// Named by meaning, not by its MUI source, so every cancel action in the app
// shares one icon. Swap the source here to change it everywhere.
export const CancelIcon = (props: SvgIconProps) => <MuiCancelIcon {...props} />;
