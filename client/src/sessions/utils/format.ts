import { PERCENT } from '../consts';

const pad = (value: number) => String(value).padStart(2, '0');

// dd/MM/yyyy, HH:mm:ss
export const formatDateTime = (date: Date) =>
  `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}, ` +
  `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

/** Formats a fraction from 0 to 1, e.g. 0.5 as `50%`. */
export const formatPercent = (fraction: number) =>
  `${Math.round(fraction * PERCENT)}%`;

// HH:mm
export const formatTime = (date: Date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;
