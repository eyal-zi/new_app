import { useCallback, useSyncExternalStore } from 'react';

/**
 * Names a draft and ties it to its shape, so two pages can't read each other's
 * draft as the wrong type. Create it once, next to the draft's type.
 */
export type DraftScope<T extends object> = {
  readonly name: string;
  /** What the draft is while nothing was remembered under the scope. */
  readonly initial: T;
  /**
   * Keys that are not the user's data (e.g. which step is open). Updating only
   * these doesn't count as an edit, see `getDraftRevision`.
   */
  readonly viewKeys: readonly (keyof T)[];
};

export const createDraftScope = <T extends object>(
  name: string,
  initial: T,
  viewKeys: readonly (keyof T)[] = [],
): DraftScope<T> => ({ name, initial, viewKeys });

/**
 * In-memory drafts, one object per scope. Deliberately a plain module-level
 * store: it outlives page navigation but not a refresh, and keeps heavy values
 * (files) out of the redux store.
 */
const drafts = new Map<string, object>();
/**
 * Counts the edits made to each scope's data. It only ever goes up, also across
 * clears, so a revision read earlier can never match a later one by accident.
 */
const revisions = new Map<string, number>();
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

const bumpRevision = (name: string) =>
  revisions.set(name, (revisions.get(name) ?? 0) + 1);

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

      const isEdit = Object.keys(changes).some(
        (key) => !scope.viewKeys.includes(key as keyof T),
      );

      drafts.set(scope.name, { ...current, ...changes });

      if (isEdit) {
        bumpRevision(scope.name);
      }

      notify(scope.name);
    },
    [scope],
  );

  return [draft, updateDraft] as const;
};

/**
 * How many edits were made to the data of the draft under `scope`. Every edit
 * counts, even one that is undone later: take it when a draft is submitted and
 * hand it to `clearDraftIfUnedited` to tell whether the user touched the data
 * since.
 */
export const getDraftRevision = (scope: DraftScope<object>) =>
  revisions.get(scope.name) ?? 0;

/** Forgets the draft under `scope`: it goes back to its initial value. */
export const clearDraft = (scope: DraftScope<object>) => {
  drafts.delete(scope.name);
  bumpRevision(scope.name);
  notify(scope.name);
};

/**
 * Forgets the draft under `scope`, but only if its data wasn't edited since
 * `revision` was taken. An edited draft is a new session and is kept.
 */
export const clearDraftIfUnedited = (
  scope: DraftScope<object>,
  revision: number,
) => {
  if (drafts.has(scope.name) && getDraftRevision(scope) === revision) {
    clearDraft(scope);
  }
};

/** Forgets every draft, e.g. when the user signs out. */
export const clearAllDrafts = () => {
  const names = [...drafts.keys()];

  drafts.clear();
  names.forEach(notify);
};
