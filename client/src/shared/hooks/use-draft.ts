import { useCallback, useState, useSyncExternalStore } from 'react';

/**
 * In-memory drafts, one object per scope. Deliberately a plain module-level
 * store: it outlives page navigation but not a refresh, and keeps heavy values
 * (files) out of the redux store.
 */
const drafts = new Map<string, object>();
const listeners = new Map<string, Set<() => void>>();

const subscribe = (scope: string, listener: () => void) => {
  const scopeListeners = listeners.get(scope) ?? new Set<() => void>();

  scopeListeners.add(listener);
  listeners.set(scope, scopeListeners);

  return () => {
    scopeListeners.delete(listener);
  };
};

const notify = (scope: string) =>
  listeners.get(scope)?.forEach((listener) => listener());

export type DraftPatch<T> = Partial<T> | ((current: T) => Partial<T>);

/**
 * The draft remembered under `scope`, or `initial` when there is none. It is
 * restored when a component using the same scope mounts again, and reset to
 * `initial` when the scope is cleared. `initial` is only read on first render.
 *
 * Returns the draft and an updater that merges a partial update into it.
 */
export const useDraft = <T extends object>(scope: string, initial: T) => {
  // Frozen so an inline object doesn't hand the store a new snapshot each render.
  const [initialDraft] = useState(initial);

  const subscribeToScope = useCallback(
    (listener: () => void) => subscribe(scope, listener),
    [scope],
  );

  const draft = useSyncExternalStore(
    subscribeToScope,
    () => (drafts.get(scope) as T | undefined) ?? initialDraft,
  );

  const updateDraft = useCallback(
    (patch: DraftPatch<T>) => {
      const current = (drafts.get(scope) as T | undefined) ?? initialDraft;
      const changes = typeof patch === 'function' ? patch(current) : patch;

      drafts.set(scope, { ...current, ...changes });
      notify(scope);
    },
    [scope, initialDraft],
  );

  return [draft, updateDraft] as const;
};

/** Forgets the draft under `scope`: it goes back to its initial value. */
export const clearDraft = (scope: string) => {
  drafts.delete(scope);
  notify(scope);
};
