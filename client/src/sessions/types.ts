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

// The search fields that hold variation info filters, set from the info filter bar.
export type InfoSearchField = 'variationa_info' | 'variationb_info';

// Status has its own dropdown and the info fields have their own bar, so none
// of them is a free-text column search field.
export type SessionSearchField = Exclude<
  keyof SessionSearchValuesDto,
  'status' | InfoSearchField
>;

export type SessionSearchFilters = Partial<Record<SessionSearchField, string>>;

export interface SessionFilters extends SessionSearchFilters {
  type?: SessionType;
  status?: SessionStatus;
}

export type InfoVariationId = 'a' | 'b';

// One property of one variation's info to filter the sessions by.
export interface InfoFilter {
  variation: InfoVariationId;
  // Unset until the user picks one; the bar then shows the first property.
  property?: string;
  value: string;
}

export type SessionColumnId = (typeof SESSION_COLUMNS)[number]['id'];

// Which columns have a filter input in the row under the header.
export type ColumnFilter =
  | { kind: 'text'; field: SessionSearchField }
  | { kind: 'type' }
  | { kind: 'status' };
