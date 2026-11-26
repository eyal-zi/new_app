import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from 'class-validator';

import {
  MAX_SEARCH_LENGTH,
  SESSION_INFO_FILTERS,
} from './sessions.constants.js';

const FILTER_NAMES = new Set(SESSION_INFO_FILTERS.map(({ name }) => name));

const findProblem = (value: unknown) => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return 'must be an object';
  }

  for (const [name, entry] of Object.entries(value)) {
    if (!FILTER_NAMES.has(name)) {
      return `has an unknown filter "${name}"`;
    }

    if (typeof entry !== 'string' || entry.length > MAX_SEARCH_LENGTH) {
      return `filter "${name}" must be a string of at most ${MAX_SEARCH_LENGTH} characters`;
    }
  }
};

/** The value must only use filters from SESSION_INFO_FILTERS, with string values. */
export const IsSessionInfoFilter =
  (validationOptions?: ValidationOptions) =>
  (target: object, propertyName: string) =>
    registerDecorator({
      name: 'isSessionInfoFilter',
      target: target.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: unknown) => findProblem(value) === undefined,
        defaultMessage: ({ property, value }: ValidationArguments) =>
          `${property} ${findProblem(value) ?? 'is invalid'}`,
      },
    });
