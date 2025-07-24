import type { Ref } from 'react';
import { useCallback } from 'react';

type OptionalRef<TRefValue> = Ref<TRefValue> | undefined;
type Cleanup = (() => void) | undefined;

/**
 * Sets both a function and object React ref
 *
 * @param ref - The reference object or callback.
 * @param value - The value to set.
 * @returns - The cleanup function that resets the reference value to null.
 */
function setRef<TRefValue>(ref: OptionalRef<TRefValue>, value: TRefValue) {
  if (typeof ref === 'function') {
    const cleanup = ref(value);
    if (typeof cleanup !== 'function') {
      return () => {
        ref(null);
      };
    }

    return cleanup;
  }

  if (ref) {
    ref.current = value;

    return () => {
      ref.current = null;
    };
  }
}

/**
 * Merges React Refs into a single memoized function ref, so you can pass it to an element
 *
 * @example
 *   const Component = forwardRef(function Component(props, ref) {
 *   const internalRef = useRef<HTMLElement>(null);
 *
 *   return <div {...props} ref={useMergedRefs(internalRef, ref)} />
 *   })
 *
 * @template TRefValue - The type of the reference value.
 * @param refs - Array containing individual refs.
 * @returns - Single memoized function ref.
 */
export function useMergeRefs<TRefValue>(...refs: OptionalRef<TRefValue>[]) {
  return useCallback((value: TRefValue | null) => {
    const cleanups = new Set<Cleanup>();

    for (const currentRef of refs) {
      const cleanup = setRef(currentRef, value);

      cleanups.add(cleanup);
    }

    return () => {
      for (const currentCleanup of cleanups) {
        currentCleanup?.();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
