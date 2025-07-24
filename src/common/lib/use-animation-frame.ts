import { useLazyRef } from './use-lazy-ref';
import { useOnMount } from './use-on-mount';

type AnimationFrameId = number;

const NOT_SCHEDULED = Symbol('indicates that no animation frame is currently scheduled');

class AnimationFrame {
  static create() {
    return new AnimationFrame();
  }

  currentId: typeof NOT_SCHEDULED | AnimationFrameId = NOT_SCHEDULED;

  request(frameRequestCallback: FrameRequestCallback) {
    this.cancel();
    this.currentId = requestAnimationFrame(frameRequestCallback);
  }

  cancel = () => {
    if (this.currentId !== NOT_SCHEDULED) {
      cancelAnimationFrame(this.currentId);
      this.currentId = NOT_SCHEDULED;
    }
  };

  disposeEffect = () => {
    return this.cancel;
  };
}

export function useAnimationFrame() {
  const animationFrame = useLazyRef(() => AnimationFrame.create()).current;

  useOnMount(animationFrame.disposeEffect);

  return animationFrame;
}
