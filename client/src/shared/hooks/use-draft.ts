import { useCallback, useSyncExternalStore } from 'react';

/**
 * Names a draft and ties it to its shape, so two pages can't read each other's
 * draft as the wrong type. Create it once, next to the draft's type.
 */
export type DraftScope<T extends object> = {
  readonly name: string;
  /** What the draft is while nothing was remembered under the scope. */
  readonly initial: T;
};

export const createDraftScope = <T extends object>(
  name: string,
  initial: T,
): DraftScope<T> => ({ name, initial });

/**
 * In-memory drafts, one object per scope. Deliberately a plain module-level
 * store: it outlives page navigation but not a refresh, and keeps heavy values
 * (files) out of the redux store.
 */
const drafts = new Map<string, object>();
const listeners = new Map<string, Set<() => void>>();

const subscribe = (name: string, listener: () => void) => {
  const scopeListeners = listeners.get(name) ?? new Set<() => void>();

  scopeListeners.add(listener);
  listeners.set(name, scopeListeners);

  return () => {
    scopeListeners.delete(listener);
  };
};

const notify = (name: string) =>
  listeners.get(name)?.forEach((listener) => listener());

const read = <T extends object>({ name, initial }: DraftScope<T>) =>
  (drafts.get(name) as T | undefined) ?? initial;

export type DraftPatch<T> = Partial<T> | ((current: T) => Partial<T>);

/**
 * The draft remembered under `scope`, or its initial value when there is none.
 * It is restored when a component using the same scope mounts again, and reset
 * to the initial value when the scope is cleared.
 *
 * Returns the draft and an updater that merges a partial update into it.
 */
export const useDraft = <T extends object>(scope: DraftScope<T>) => {
  const subscribeToScope = useCallback(
    (listener: () => void) => subscribe(scope.name, listener),
    [scope.name],
  );

  const draft = useSyncExternalStore(subscribeToScope, () => read(scope));

  const updateDraft = useCallback(
    (patch: DraftPatch<T>) => {
      const current = read(scope);
      const changes = typeof patch === 'function' ? patch(current) : patch;

      drafts.set(scope.name, { ...current, ...changes });
      notify(scope.name);
    },
    [scope],
  );

  return [draft, updateDraft] as const;
};

/** Forgets the draft under `scope`: it goes back to its initial value. */
export const clearDraft = (scope: DraftScope<object>) => {
  drafts.delete(scope.name);
  notify(scope.name);
};

/**
 * Forgets the draft under `scope`, but only if `matches` accepts what is
 * remembered right now. Use it to clear a draft that was submitted without
 * discarding a newer one the user started in the meantime.
 */
export const clearDraftIf = <T extends object>(
  scope: DraftScope<T>,
  matches: (current: T) => boolean,
) => {
  if (drafts.has(scope.name) && matches(read(scope))) {
    clearDraft(scope);
  }
};

/** Forgets every draft, e.g. when the user signs out. */
export const clearAllDrafts = () => {
  const names = [...drafts.keys()];

  drafts.clear();
  names.forEach(notify);
};
