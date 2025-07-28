import type { ComponentProps } from 'react';
import { useRef, useState } from 'react';

import { cx } from '~/common/lib/cx';
import { dataAttribute } from '~/common/lib/dom';
import { useDebouncedCallback } from '~/common/lib/flow-control';
import { useEventCallback } from '~/common/lib/use-event-callback';
import { useInView } from '~/common/lib/use-in-view';
import { useMeasure } from '~/common/lib/use-measure';
import { useMergeRefs } from '~/common/lib/use-merge-refs';
import { useModernLayoutEffect } from '~/common/lib/use-modern-layout-effect';

const SCROLL_DEBOUNCE_TIME_MS = 100;

/**
 * The target for navigation within the scroller.
 *
 * - `start` first visible item inside the scroller
 * - `end` last visible item inside the scroller
 * - `next` first invisible item after the `end` item (outside of viewport)
 * - `previous` first invisible item before the `start` item (outside of viewport)
 */
type NavigateTarget = 'start' | 'end' | 'next' | 'previous';

interface NavigateOptions {
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
}

function findTargetElement(target: NavigateTarget) {
  const elements = document.querySelectorAll<HTMLElement>('[data-scroller-item]');

  if (elements.length === 0) {
    return null;
  }

  const elementsList = Array.from(elements);

  if (target === 'end' || target === 'next') {
    elementsList.reverse();
  }

  const targetElement = elementsList.find((element) => {
    return element.dataset.visible === '';
  });

  if (!targetElement) {
    return null;
  }

  switch (target) {
    case 'start':
    case 'end': {
      return targetElement;
    }

    case 'next':
    case 'previous': {
      const index = elementsList.indexOf(targetElement);
      const newTargetElement = elementsList.at(index - 1);

      return newTargetElement ?? null;
    }

    default: {
      return targetElement;
    }
  }
}

/** The minimum intersection ratio for an item to be considered visible. */
const VIEW_TOLERANCE = 0.5;

interface ItemProps extends ComponentProps<'div'> {
  scrollerElement: HTMLDivElement | null;
}

function Item(props: ItemProps) {
  const { scrollerElement, children, ref } = props;
  const {
    ref: observerRef,
    inView,
    entry,
  } = useInView({ root: scrollerElement, threshold: [0, VIEW_TOLERANCE, 1] });
  const mergedRef = useMergeRefs(ref, observerRef);
  const isVisible = inView && (entry?.intersectionRatio ?? 0) > VIEW_TOLERANCE;

  return (
    <div
      data-scroller-item=""
      data-visible={dataAttribute(isVisible)}
      ref={mergedRef}
      className="grid h-full w-[300px] snap-start place-content-center border"
    >
      <div className="text-2xl font-bold">{children}</div>
    </div>
  );
}

function scrollElement(scroller: HTMLElement, target: HTMLElement, options: NavigateOptions) {
  // const { align = 'start' } = options;
  // const { scrollLeft, clientWidth } = scroller;
  // const targetRect = target.getBoundingClientRect();
  // const scrollerRect = scroller.getBoundingClientRect();
  // const targetLeft = targetRect.left - scrollerRect.left + scrollLeft;
  // const targetRight = targetRect.right - scrollerRect.left + scrollLeft;
  // const targetWidth = targetRect.width;
  // let newScrollLeft = targetLeft;
  // if (align === 'center') {
  //   newScrollLeft = targetLeft - (clientWidth - targetWidth) / 2;
  // } else if (align === 'end') {
  //   newScrollLeft = targetRight - clientWidth;
  // }
  // // Ensure the new scroll position is within bounds
  // newScrollLeft = Math.max(0, newScrollLeft);
  // newScrollLeft = Math.min(newScrollLeft, scroller.scrollWidth - clientWidth);
  // // Scroll to the new position
  // scroller.scrollTo({
  //   left: newScrollLeft,
  //   behavior: 'smooth',
  // });
}

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

  const navigate = useEventCallback((target: NavigateTarget, options: NavigateOptions) => {
    if (scrollerElement === null) {
      return;
    }

    const targetElement = findTargetElement(target);

    if (!targetElement) {
      return;
    }

    scrollElement(scrollerElement, targetElement, options);
  });

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
          <Item key={current} scrollerElement={scrollerElement}>
            {current}
          </Item>
        ))}
      </div>

      <div className="flex justify-center gap-4 py-2">
        <button
          onClick={() => {
            navigate('start', { align: 'end' });
          }}
          disabled={!canGoToPrevious}
          type="button"
          className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          Go To Previous
        </button>

        <button
          onClick={() => {
            navigate('end', { align: 'start' });
          }}
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
