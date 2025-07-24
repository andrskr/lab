import { useSyncExternalStore } from 'react';

import { NOOP } from './noop';

function subscribe() {
  return NOOP;
}

export function useIsHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
