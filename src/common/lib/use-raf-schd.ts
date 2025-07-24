import { rafSchd } from '~/common/lib/raf-schd';

import type { AnyCallback } from './any-callback';
import { useLazyRef } from './use-lazy-ref';
import { useOnMount } from './use-on-mount';

const NOT_SCHEDULED = Symbol('indicates that no callback is currently scheduled');

type Scheduled<TCallback extends AnyCallback = AnyCallback> = ReturnType<typeof rafSchd<TCallback>>;

class Scheduler {
  static create() {
    return new Scheduler();
  }

  private scheduled: typeof NOT_SCHEDULED | Scheduled = NOT_SCHEDULED;

  schedule<TCallback extends AnyCallback>(callback: TCallback): Scheduled<TCallback> {
    this.clear();
    this.scheduled = rafSchd(callback);

    return this.scheduled as Scheduled<TCallback>;
  }

  clear = () => {
    if (this.scheduled !== NOT_SCHEDULED) {
      this.scheduled.cancel();
      this.scheduled = NOT_SCHEDULED;
    }
  };

  disposeEffect = () => {
    return this.clear;
  };
}

export function useRafSchd() {
  const scheduler = useLazyRef(() => Scheduler.create()).current;

  useOnMount(scheduler.disposeEffect);

  return scheduler;
}
