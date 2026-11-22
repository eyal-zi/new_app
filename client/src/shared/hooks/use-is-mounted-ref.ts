import { useEffect, useRef } from 'react';

/** A ref that is `true` while the component is mounted, for async work that can outlive it. */
export const useIsMountedRef = () => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
};
