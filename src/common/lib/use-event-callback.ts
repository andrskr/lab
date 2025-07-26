import { useInsertionEffect } from 'react';

import { isDevelopment } from '../env';

import type { AnyFunction } from './any-function';
import { useLazyRef } from './use-lazy-ref';

interface Stable<TCallback extends AnyFunction> {
  next: TCallback | undefined;
  current: TCallback | undefined;
  invoker: TCallback;
  effect: () => void;
}

function assertNotCalled() {
  if (isDevelopment) {
    throw new Error('Can not call an event handler during rendering phase.');
  }
}

function createStable() {
  const stable: Stable<AnyFunction> = {
    next: undefined,
    current: assertNotCalled as never,

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    invoker: (...arguments_: unknown[]) => stable.current?.(...arguments_),
    effect: () => {
      stable.current = stable.next;
    },
  };

  return stable;
}

export function useEventCallback<TCallback extends AnyFunction>(callback: TCallback | undefined) {
  const stable = useLazyRef(createStable).current as Stable<TCallback>;

  stable.next = callback;

  useInsertionEffect(stable.effect);

  return stable.invoker;
}
