import { useMe } from '@/api/generated/api';

/** The signed-in user's name, sent as the owner of sessions they create. */
export const useSessionOwner = () => useMe().data?.username;
