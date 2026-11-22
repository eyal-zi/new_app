import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { type MouseEvent, useState } from 'react';

import { SESSION_ACTIONS } from '../consts';
import type { SessionAction } from '../types';

export const RowOptions = ({
  sessionId,
  actions,
  onSelect,
}: {
  sessionId: string;
  actions: readonly SessionAction[];
  onSelect: (action: SessionAction) => void;
}) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const openMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchor(event.currentTarget);
  const closeMenu = () => setAnchor(null);

  const selectAction = (action: SessionAction) => {
    closeMenu();
    onSelect(action);
  };

  const renderItem = (action: SessionAction) => {
    const { label, icon: Icon } = SESSION_ACTIONS[action];

    return (
      <MenuItem key={action} onClick={() => selectAction(action)}>
        <ListItemIcon>
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{label}</ListItemText>
      </MenuItem>
    );
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label={`Options for session ${sessionId}`}
        aria-haspopup="menu"
        onClick={openMenu}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={closeMenu}>
        {actions.map(renderItem)}
      </Menu>
    </>
  );
};
