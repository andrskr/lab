import { useLazyRef } from './use-lazy-ref';
import { useOnMount } from './use-on-mount';

type TimeoutId = ReturnType<typeof setTimeout>;

const NOT_SET = Symbol('indicates that no timeout is currently set');

class Timeout {
  static create() {
    return new Timeout();
  }

  currentId: typeof NOT_SET | TimeoutId = NOT_SET;

  start(delay: number, callback: () => void) {
    this.clear();
    this.currentId = setTimeout(() => {
      callback();
      this.currentId = NOT_SET;
    }, delay);
  }

  clear = () => {
    if (this.currentId !== NOT_SET) {
      clearTimeout(this.currentId);
      this.currentId = NOT_SET;
    }
  };

  disposeEffect = () => {
    return this.clear;
  };
}

export function useTimeout() {
  const timeout = useLazyRef(() => Timeout.create()).current;

  useOnMount(timeout.disposeEffect);

  return timeout;
}
