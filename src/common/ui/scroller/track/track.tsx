import { cx } from '~/common/lib/cx';
import { dataAttribute } from '~/common/lib/dom';
import { mergeProps } from '~/common/lib/merge-props';
import { useRender } from '~/common/lib/use-render';

import { useRootContext } from '../root/root-context';

type TrackComponent = 'div';

export namespace Track {
  export interface Props extends useRender.ComponentProps<TrackComponent> {
    /**
     * Whether to hide the scrollbar of the track.
     *
     * Defaults to `true`.
     */
    scrollbarHidden?: boolean;
  }
}

const trackDataAttributes = {
  scrollbarHidden: 'data-scrollbar-hidden',
};

export function Track(props: Track.Props) {
  const { render = <div />, scrollbarHidden = true, className, ...restProps } = props;

  const { onTrackElementChange } = useRootContext();

  const defaultProps: useRender.ElementProps<TrackComponent> = {
    [trackDataAttributes.scrollbarHidden]: dataAttribute(scrollbarHidden),
    className: cx(
      '[--scroller-items-gutter:theme(spacing.4)]',
      '[--scroller-edge-gutter:theme(spacing.4)]',
      '[--scroller-item-align:start]',
      '[--scroller-cols:calc((100%-(var(--scroller-visible-items)-1)*var(--scroller-items-gutter))_/_var(--scroller-visible-items))]',
      'data-scrollbar-hidden:scrollbar-hidden',
      'relative grid h-[400px] snap-always scroll-px-(--scroller-edge-gutter) auto-cols-(--scroller-cols) grid-flow-col gap-(--scroller-items-gutter) overflow-x-auto overflow-y-hidden overscroll-contain px-(--scroller-edge-gutter) outline-none not-data-animation:snap-x not-data-animation:snap-mandatory motion-safe:scroll-smooth',
      className,
    ),
  };

  const element = useRender({
    render,
    ref: onTrackElementChange,
    props: mergeProps<TrackComponent>(defaultProps, restProps),
  });

  return element;
}
