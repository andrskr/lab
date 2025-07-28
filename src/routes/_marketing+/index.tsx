import { useRef, useState } from 'react';

import { cx } from '~/common/lib/cx';
import { useDebouncedCallback } from '~/common/lib/flow-control';
import { useEventCallback } from '~/common/lib/use-event-callback';
import { useMeasure } from '~/common/lib/use-measure';
import { useModernLayoutEffect } from '~/common/lib/use-modern-layout-effect';

const SCROLL_DEBOUNCE_TIME_MS = 100;

export default function Index() {
  const [scrollerElement, setScrollerElement] = useState<HTMLDivElement | null>(null);
  const [canGoToNext, setCanGoToNext] = useState(true);
  const [canGoToPrevious, setCanGoToPrevious] = useState(false);
  const nextTrigger = useRef<HTMLElement>(null);
  const previousTrigger = useRef<HTMLElement>(null);

  const syncScrollState = useEventCallback(() => {
    if (scrollerElement === null) {
      return;
    }

    const { scrollLeft, clientWidth, scrollWidth } = scrollerElement;

    // Use a small tolerance to account for sub-pixel rendering and floating-point precision
    const SCROLL_TOLERANCE = 1;

    const canScrollNext = scrollLeft + clientWidth < scrollWidth - SCROLL_TOLERANCE;
    const canScrollPrevious = scrollLeft > SCROLL_TOLERANCE;

    const previousTriggerElement = previousTrigger.current;
    const nextTriggerElement = nextTrigger.current;

    if (nextTriggerElement && document.activeElement === nextTriggerElement && !canScrollNext) {
      previousTriggerElement?.focus();
    }

    if (
      previousTriggerElement &&
      document.activeElement === previousTriggerElement &&
      !canScrollPrevious
    ) {
      nextTriggerElement?.focus();
    }

    setCanGoToPrevious(canScrollPrevious);
    setCanGoToNext(canScrollNext);
  });

  const handleScrollStateSync = useDebouncedCallback(syncScrollState, {
    wait: SCROLL_DEBOUNCE_TIME_MS,
    leading: true,
    trailing: true,
  });

  useMeasure({
    ref: scrollerElement,
    onResize: handleScrollStateSync,
  });

  useModernLayoutEffect(
    function registerScrollerElementEvents() {
      if (scrollerElement === null) {
        return;
      }

      handleScrollStateSync();

      const currentScrollHandler = handleScrollStateSync;
      const currentScrollerElement = scrollerElement;

      currentScrollerElement.addEventListener('scroll', currentScrollHandler, true);

      return function disposeScrollerElementEvents() {
        currentScrollerElement.removeEventListener('scroll', currentScrollHandler, true);
      };
    },
    [handleScrollStateSync, scrollerElement],
  );

  return (
    <div>
      <div
        ref={setScrollerElement}
        className={cx(
          '[--scroller-items-gutter:theme(spacing.4)]',
          '[--scroller-edge-gutter:theme(spacing.4)]',
          '[--scroller-cols:calc((100%-(var(--scroller-visible-items)-1)*var(--scroller-items-gutter))_/_var(--scroller-visible-items))]',
          'grid h-[400px] snap-always scroll-px-(--scroller-edge-gutter) auto-cols-(--scroller-cols) grid-flow-col gap-(--scroller-items-gutter) overflow-x-auto overflow-y-hidden overscroll-contain px-(--scroller-edge-gutter) not-data-animation:snap-x not-data-animation:snap-mandatory motion-safe:scroll-smooth',
        )}
      >
        {Array.from({ length: 20 }, (_, index) => index).map((current) => (
          <div
            key={current}
            className="grid h-full w-[300px] snap-start place-content-center border"
          >
            <div className="text-2xl font-bold">{current}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 py-2">
        <button
          disabled={!canGoToPrevious}
          type="button"
          className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          Go To Previous
        </button>

        <button
          disabled={!canGoToNext}
          type="button"
          className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          Go To Next
        </button>
      </div>
    </div>
  );
}
