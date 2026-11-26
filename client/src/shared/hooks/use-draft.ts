import { useBlocker } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { type SessionType } from '@/api/generated/model';

/**
 * Unfinished sessions, one per session type. Module memory survives moving
 * between pages but not a refresh, and keeps files out of the app store.
 * Sign-out and disconnection are deliberately not handled: they keep drafts.
 */
const drafts = new Map<SessionType, object>();

/**
 * Forgets the saved draft, once its session was created. Call it after
 * navigating away, so the form doesn't blank out under the user. `navigate` is
 * assumed to succeed.
 */
export const deleteDraft = (type: SessionType) => {
  drafts.delete(type);
};

/**
 * State that is restored when the page of `type` is opened again. It needs no
 * subscriptions, since only the open page edits its draft: with
 * `useBlockLeavingWhileSending`, a request can't finish after its page was left.
 */
export const useDraft = <T extends object>(
  type: SessionType,
  emptyDraft: T,
) => {
  const [draft, setDraft] = useState(
    () => (drafts.get(type) as T | undefined) ?? emptyDraft,
  );

  useEffect(() => {
    drafts.set(type, draft);
  }, [type, draft]);

  const updateDraft = (changes: Partial<T>) =>
    setDraft((current) => ({ ...current, ...changes }));
  const resetDraft = () => setDraft(emptyDraft);

  return [draft, updateDraft, resetDraft] as const;
};

/**
 * Blocks leaving the page while its draft is being sent, so the draft can't
 * change under the request. A refresh stays allowed (drafts are meant to be
 * lost then). The page's own redirect needs `ignoreBlocker`.
 */
export const useBlockLeavingWhileSending = (isSending: boolean) => {
  useBlocker({ shouldBlockFn: () => isSending, enableBeforeUnload: false });
};
