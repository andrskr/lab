import type { RefObject } from 'react';
import { useRef } from 'react';

const unitizlizedToken = Symbol('Token to indicate that the lazy ref has been initialized or not');

export function useLazyRef<TResult>(init: () => TResult): RefObject<TResult>;

export function useLazyRef<TResult, TArgument>(
  init: (init: TArgument) => TResult,
  argument: TArgument,
): RefObject<TResult>;

export function useLazyRef(init: (argument?: unknown) => unknown, argument?: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef(unitizlizedToken as any);

  if (ref.current === unitizlizedToken) {
    ref.current = init(argument);
  }

  return ref as RefObject<unknown>;
}
