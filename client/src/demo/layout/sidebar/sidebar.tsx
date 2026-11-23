import { List, useMediaQuery, useTheme } from '@mui/material';

import {
  SidebarItem,
  type SidebarItemProps,
} from '../sidebar-item/sidebar-item';
import { SIDEBAR_ENTRIES } from './consts';
import { MobileSidebarDrawer, SidebarDrawer } from './sidebar.styles';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });

  const renderEntry = (entry: SidebarItemProps) => (
    <SidebarItem
      key={entry.to}
      {...entry}
      onNavigate={desktop ? undefined : onClose}
    />
  );
  const items = <List>{SIDEBAR_ENTRIES.map(renderEntry)}</List>;

  if (desktop) {
    return <SidebarDrawer variant="permanent">{items}</SidebarDrawer>;
  }

  return (
    <MobileSidebarDrawer variant="temporary" open={open} onClose={onClose}>
      {items}
    </MobileSidebarDrawer>
  );
};
