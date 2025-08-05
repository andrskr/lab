import type { RefCallback, RefObject } from 'react';
import { createContext, use } from 'react';

/**
 * The target for navigation within the scroller.
 *
 * - `start` first visible item inside the scroller
 * - `end` last visible item inside the scroller
 * - `next` first invisible item after the `end` item (outside of viewport)
 * - `previous` first invisible item before the `start` item (outside of viewport)
 */
export type NavigateTarget = 'start' | 'end' | 'next' | 'previous';

export interface NavigateOptions {
  /**
   * The alignment of the item in the viewport after scrolling.
   *
   * - `start` aligns the item to the start of the viewport.
   * - `center` aligns the item to the center of the viewport.
   * - `end` aligns the item to the end of the viewport.
   *
   * Defaults to `start`.
   */
  align?: 'start' | 'center' | 'end';
  /**
   * The number of items next to the target to scroll to. For example, if `sibling` is `1`, the
   * scroller will scroll to the item next to the target item. If `sibling` is `2`, it will scroll
   * to the item two items after the target item. Negative values can be used to scroll to items
   * before the target.
   */
  sibling?: number;
}

export interface RootContextValue {
  onTrackElementChange: RefCallback<HTMLElement | null>;
  trackElement: HTMLElement | null;
  navigate: (target: NavigateTarget, options?: NavigateOptions) => void;
  canGoToNext: boolean;
  nextTrigger: RefObject<HTMLElement | null>;
  canGoToPrevious: boolean;
  previousTrigger: RefObject<HTMLElement | null>;
}

export const RootContext = createContext<RootContextValue | undefined>(undefined);
RootContext.displayName = 'Scroller.RootContext';

export function useRootContext() {
  const context = use(RootContext);

  if (context === undefined) {
    throw new Error(
      'Scroller.RootContext is missing. Scroller parts must be used within the <Scroller.Root>.',
    );
  }

  return context;
}
