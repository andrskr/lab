import type { ReactNode } from 'react';
import { useMemo, useRef, useState } from 'react';

import { clamp } from '~/common/lib/clamp';
import { useThrottledCallback } from '~/common/lib/flow-control';
import { useEventCallback } from '~/common/lib/use-event-callback';
import { useMeasure } from '~/common/lib/use-measure';
import { useModernLayoutEffect } from '~/common/lib/use-modern-layout-effect';

import type { NavigateOptions, NavigateTarget, RootContextValue } from './root-context';
import { RootContext } from './root-context';

const SCROLL_THROTTLE_TIME_MS = 100;

function findTargetElement(target: NavigateTarget, options: Required<NavigateOptions>) {
  const { sibling } = options;

  const elements = document.querySelectorAll<HTMLElement>('[data-scroller-item]');
  if (elements.length === 0) {
    return null;
  }

  // Find all visible elements with their intersection ratios
  const visibleElements = Array.from(elements)
    .map((element, index) => ({
      element,
      index,
      intersectionRatio: Number.parseFloat(element.dataset.intersectionRatio ?? '0'),
    }))
    .filter((item) => item.intersectionRatio > 0);

  if (visibleElements.length === 0) {
    return null;
  }

  // Find the maximum intersection ratio among visible elements
  const maxIntersectionRatio = Math.max(...visibleElements.map((item) => item.intersectionRatio));

  // Find first and last elements with the maximum intersection ratio
  const mostVisibleElements = visibleElements.filter(
    (item) => item.intersectionRatio === maxIntersectionRatio,
  );

  const firstMostVisible = mostVisibleElements.at(0)!;
  const lastMostVisible = mostVisibleElements.at(-1)!;

  // If only one most visible element and targeting start/end, switch to previous/next
  let effectiveTarget = target;
  if (
    mostVisibleElements.length === 1 &&
    (target === 'start' || target === 'end') &&
    sibling === 0
  ) {
    effectiveTarget = target === 'start' ? 'previous' : 'next';
  }

  // Determine target index
  let targetIndex: number;
  switch (effectiveTarget) {
    case 'start': {
      targetIndex = firstMostVisible.index;
      break;
    }
    case 'end': {
      targetIndex = lastMostVisible.index;
      break;
    }
    case 'next': {
      targetIndex = lastMostVisible.index + 1;
      break;
    }
    case 'previous': {
      targetIndex = firstMostVisible.index - 1;
      break;
    }
    default: {
      targetIndex = firstMostVisible.index;
      break;
    }
  }

  const effectiveIndex = clamp(targetIndex + sibling, 0, elements.length - 1);
  return elements[effectiveIndex];
}

function scrollToElement(
  scroller: HTMLElement,
  target: HTMLElement,
  options: Required<NavigateOptions>,
) {
  const { align } = options;

  const scrollerRect = scroller.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const scrollerStyles = getComputedStyle(scroller);
  const paddingLeft = Number.parseFloat(scrollerStyles.paddingLeft) || 0;
  const paddingRight = Number.parseFloat(scrollerStyles.paddingRight) || 0;

  const offsetLeft = targetRect.left - scrollerRect.left + scroller.scrollLeft - paddingLeft;
  const availableWidth = scroller.clientWidth - paddingLeft - paddingRight;

  let scrollTo: number;

  switch (align) {
    case 'center': {
      scrollTo = offsetLeft - availableWidth / 2 + target.clientWidth / 2;
      break;
    }
    case 'end': {
      scrollTo = offsetLeft - availableWidth + target.clientWidth;
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

export namespace Root {
  export interface Props {
    children: ReactNode;
  }
}

export function Root(props: Root.Props) {
  const { children } = props;

  const [trackElement, setTrackElement] = useState<HTMLElement | null>(null);
  const [canGoToNext, setCanGoToNext] = useState(true);
  const [canGoToPrevious, setCanGoToPrevious] = useState(false);
  const nextTrigger = useRef<HTMLElement>(null);
  const previousTrigger = useRef<HTMLElement>(null);

  const syncScrollState = useEventCallback(() => {
    if (trackElement === null) {
      return;
    }

    const { scrollLeft, clientWidth, scrollWidth } = trackElement;

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
    ref: trackElement,
    onResize: handleScrollStateSync,
  });

  useModernLayoutEffect(
    function registertrackElementEvents() {
      if (trackElement === null) {
        return;
      }

      handleScrollStateSync();

      const currentScrollHandler = handleScrollStateSync;
      const currenttrackElement = trackElement;

      currenttrackElement.addEventListener('scroll', currentScrollHandler, true);

      return function disposetrackElementEvents() {
        currenttrackElement.removeEventListener('scroll', currentScrollHandler, true);
      };
    },
    [handleScrollStateSync, trackElement],
  );

  const navigate = useEventCallback((target: NavigateTarget, options?: NavigateOptions) => {
    if (trackElement === null) {
      return;
    }

    const effectiveOptions: Required<NavigateOptions> = {
      align: options?.align ?? 'start',
      sibling: options?.sibling ?? 0,
    };

    const targetElement = findTargetElement(target, effectiveOptions);

    if (!targetElement) {
      return;
    }

    console.log(targetElement);

    scrollToElement(trackElement, targetElement, effectiveOptions);
  });

  const contextValue: RootContextValue = useMemo(() => {
    return {
      onTrackElementChange: setTrackElement,
      trackElement,
      canGoToNext,
      nextTrigger,
      canGoToPrevious,
      previousTrigger,
      navigate,
    };
  }, [canGoToNext, canGoToPrevious, navigate, trackElement]);

  return <RootContext value={contextValue}>{children}</RootContext>;
}
