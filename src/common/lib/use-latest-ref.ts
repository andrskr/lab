import { useLazyRef } from './use-lazy-ref';
import { useModernLayoutEffect } from './use-modern-layout-effect';

function createLatestRef<TValue>(value: TValue) {
  const latest = {
    current: value,
    next: value,
    effect: () => {
      latest.current = latest.next;
    },
  };

  return latest;
}

export function useLatestRef<TValue>(value: TValue) {
  const latest = useLazyRef(createLatestRef, value).current;

  latest.next = value;

  useModernLayoutEffect(latest.effect);

  return latest;
}
