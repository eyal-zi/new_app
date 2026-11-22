import type { SvgIconProps } from '@mui/material';
import type { ComponentType } from 'react';

import type {
  SessionSearchValuesDto,
  SessionStatus,
  SessionType,
} from '@/api/generated/model';

import type { SESSION_COLUMNS } from './consts';

// The server speaks snake_case; the client works with camelCase.
export interface Session {
  id: string;
  type: SessionType;
  owner: string;
  imageAUrl: string;
  imageBUrl: string;
  createdAt: Date;
  updatedAt: Date;
  progress: number | null;
  status: SessionStatus;
}

// What the row's options menu asks the page to do with a session.
export type SessionAction = 'delete' | 'cancel';

// How an action shows in the row menu (label, icon) and its confirmation dialog.
export interface SessionActionConfig {
  label: string;
  icon: ComponentType<SvgIconProps>;
  title: string;
  getDescription: (id: string) => string;
  successMessage: string;
  shouldDelete: boolean;
}

export interface ViewedImage {
  src: string;
  alt: string;
}

export type ImageOpener = (image: ViewedImage) => void;

export type SessionActionHandler = (
  session: Session,
  action: SessionAction,
) => void;

// Status has its own dropdown, so it is not a free-text search field.
export type SessionSearchField = Exclude<
  keyof SessionSearchValuesDto,
  'status'
>;

export type SessionSearchFilters = Partial<Record<SessionSearchField, string>>;

export interface SessionFilters extends SessionSearchFilters {
  type?: SessionType;
  status?: SessionStatus;
}

export type SessionColumnId = (typeof SESSION_COLUMNS)[number]['id'];

// Which columns have a filter input in the row under the header.
export type ColumnFilter =
  | { kind: 'text'; field: SessionSearchField }
  | { kind: 'type' }
  | { kind: 'status' };
