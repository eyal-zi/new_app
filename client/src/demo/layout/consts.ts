import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SummarizeIcon from '@mui/icons-material/Summarize';

import { SESSIONS_PATH } from '@/sessions/consts';
import { SUMMARY_B_PATH, SUMMARY_C_PATH, SUMMARY_PATH } from '@/summary/consts';

import type { SidebarItemProps } from './sidebar-item';

export const SIDEBAR_WIDTH = 240;

export const SIDEBAR_ENTRIES: SidebarItemProps[] = [
  { label: 'Dashboard', to: '/', icon: DashboardIcon },
  { label: 'Sessions', to: SESSIONS_PATH, icon: ListAltIcon },
  { label: 'Summary', to: SUMMARY_PATH, icon: SummarizeIcon },
  { label: 'Summary B', to: SUMMARY_B_PATH, icon: SummarizeIcon },
  { label: 'Summary C', to: SUMMARY_C_PATH, icon: SummarizeIcon },
];
