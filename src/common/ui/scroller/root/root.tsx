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

  let firstVisible: HTMLElement | null = null;
  let lastVisible: HTMLElement | null = null;
  let firstVisibleIndex = -1;
  let lastVisibleIndex = -1;

  for (const [index, element] of elements.entries()) {
    const intersectionRatio = Number.parseFloat(element.dataset.intersectionRatio ?? '0');
    const isInvisible = intersectionRatio === 0;

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
  if (visibleCount === 1 && (target === 'start' || target === 'end') && sibling === 0) {
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
