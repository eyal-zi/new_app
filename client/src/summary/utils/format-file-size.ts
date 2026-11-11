import { FILE_SIZE_UNIT_STEP, FILE_SIZE_UNITS } from '../consts';

export const formatFileSize = (bytes: number) => {
  let value = bytes;
  let unitIndex = 0;

  while (
    value >= FILE_SIZE_UNIT_STEP &&
    unitIndex < FILE_SIZE_UNITS.length - 1
  ) {
    value /= FILE_SIZE_UNIT_STEP;
    unitIndex += 1;
  }

  const digits = unitIndex === 0 ? 0 : 1;

  return `${value.toFixed(digits)} ${FILE_SIZE_UNITS[unitIndex]}`;
};
