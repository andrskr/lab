import type { ComponentProps } from 'react';
import { useRef, useState } from 'react';

import { clamp } from '~/common/lib/clamp';
import { cx } from '~/common/lib/cx';
import { dataAttribute } from '~/common/lib/dom';
import { useThrottledCallback } from '~/common/lib/flow-control';
import { useEventCallback } from '~/common/lib/use-event-callback';
import { useInView } from '~/common/lib/use-in-view';
import { useMeasure } from '~/common/lib/use-measure';
import { useMergeRefs } from '~/common/lib/use-merge-refs';
import { useModernLayoutEffect } from '~/common/lib/use-modern-layout-effect';

const SCROLL_THROTTLE_TIME_MS = 100;

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
  /**
   * The number of items next to the target to scroll to. For example, if `sibling` is `1`, the
   * scroller will scroll to the item next to the target item. If `sibling` is `2`, it will scroll
   * to the item two items after the target item. Negative values can be used to scroll to items
   * before the target.
   */
  sibling?: number;
}

function findTargetElement(target: NavigateTarget, options?: NavigateOptions) {
  const { sibling = 0 } = options ?? {};

  const elements = document.querySelectorAll<HTMLElement>('[data-scroller-item]');
  if (elements.length === 0) {
    return null;
  }

  let firstVisible: HTMLElement | null = null;
  let lastVisible: HTMLElement | null = null;
  let firstVisibleIndex = -1;
  let lastVisibleIndex = -1;

  for (const [index, element] of elements.entries()) {
    const isInvisible = element.dataset.visible === undefined;
    const lastVisibleSet = lastVisible !== null;

    if (isInvisible && lastVisibleSet) {
      /** There is no point in continuing the loop if we already found all visible elements */
      break;
    }

    if (isInvisible) {
      continue;
    }

    if (firstVisible === null) {
      firstVisible = element;
      firstVisibleIndex = index;
    }

    lastVisible = element;
    lastVisibleIndex = index;
  }

  const visibleCount = firstVisible ? lastVisibleIndex - firstVisibleIndex + 1 : 0;

  /** If only one visible and targeting start/end, switch to previous/next */
  let effectiveTarget = target;
  if (visibleCount === 1 && (target === 'start' || target === 'end')) {
    effectiveTarget = target === 'start' ? 'previous' : 'next';
  }

  let targetIndex: number | null = null;
  switch (effectiveTarget) {
    case 'start': {
      targetIndex = firstVisibleIndex;
      break;
    }
    case 'end': {
      targetIndex = lastVisibleIndex;
      break;
    }
    case 'next': {
      targetIndex = lastVisibleIndex + 1;
      break;
    }
    case 'previous': {
      targetIndex = firstVisibleIndex - 1;
      break;
    }
    default: {
      targetIndex = firstVisibleIndex;
      break;
    }
  }

  const effectiveIndex =
    visibleCount > 1 ? clamp(targetIndex + sibling, 0, elements.length - 1) : targetIndex;

  return elements[effectiveIndex];
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
      className={cx(
        '[scroll-snap-align:var(--scroller-item-align,start)]',
        'grid h-full w-[300px] place-content-center border',
      )}
    >
      <div className="text-2xl font-bold">{children}</div>
    </div>
  );
}

function scrollElement(scroller: HTMLElement, target: HTMLElement, options: NavigateOptions) {
  const { align = 'start' } = options;

  const scrollerRect = scroller.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const offsetLeft = targetRect.left - scrollerRect.left + scroller.scrollLeft;

  let scrollTo: number;

  switch (align) {
    case 'center': {
      scrollTo = offsetLeft - scroller.clientWidth / 2 + target.clientWidth / 2;
      break;
    }
    case 'end': {
      scrollTo = offsetLeft - scroller.clientWidth + target.clientWidth;
      break;
    }
    default: {
      scrollTo = offsetLeft;
      break;
    }
  }

  scroller.scrollTo({
    left: scrollTo,
    behavior: 'smooth',
  });
}

const items = Array.from({ length: 20 }, (_, index) => index);

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

  const handleScrollStateSync = useThrottledCallback(syncScrollState, {
    wait: SCROLL_THROTTLE_TIME_MS,
    leading: true,
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

    const targetElement = findTargetElement(target, options);

    if (!targetElement) {
      return;
    }

    scrollElement(scrollerElement, targetElement, options);
  });

  return (
    <div>
      <div
        ref={setScrollerElement}
        data-scrollbar-hidden=""
        className={cx(
          '[--scroller-items-gutter:theme(spacing.4)]',
          '[--scroller-edge-gutter:theme(spacing.4)]',
          /** TODO: control using prop (e.g. align) */
          '[--scroller-item-align:start]',
          '[--scroller-cols:calc((100%-(var(--scroller-visible-items)-1)*var(--scroller-items-gutter))_/_var(--scroller-visible-items))]',
          'data-scrollbar-hidden:scrollbar-hidden',
          'relative grid h-[400px] snap-always scroll-px-(--scroller-edge-gutter) auto-cols-(--scroller-cols) grid-flow-col gap-(--scroller-items-gutter) overflow-x-auto overflow-y-hidden overscroll-contain px-(--scroller-edge-gutter) not-data-animation:snap-x not-data-animation:snap-mandatory motion-safe:scroll-smooth',
        )}
      >
        {items.map((current) => (
          <Item key={current} scrollerElement={scrollerElement}>
            {current}
          </Item>
        ))}
      </div>

      <div className="flex justify-center gap-4 py-2">
        <button
          onClick={() => {
            navigate('start', { align: 'start', sibling: -1 });
          }}
          disabled={!canGoToPrevious}
          type="button"
          className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          -1
        </button>
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

        <button
          onClick={() => {
            navigate('end', { align: 'end', sibling: 1 });
          }}
          disabled={!canGoToNext}
          type="button"
          className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          +1
        </button>
      </div>
    </div>
  );
}
