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
    /**
     * Variant of the track.
     *
     * - `normal`: Normal track with no special styling.
     * - `inset`: "Full-bleed" track that fills the entire scroller area.
     *
     * Defaults to `inset`.
     */
    variant?: 'normal' | 'inset';
  }
}

const trackDataAttributes = {
  scrollbarHidden: 'data-scrollbar-hidden',
  variant: 'data-variant',
};

export function Track(props: Track.Props) {
  const {
    render = <div />,
    scrollbarHidden = true,
    className,
    variant = 'inset',
    ...restProps
  } = props;

  const { onTrackElementChange } = useRootContext();

  const defaultProps: useRender.ElementProps<TrackComponent> = {
    [trackDataAttributes.scrollbarHidden]: dataAttribute(scrollbarHidden),
    [trackDataAttributes.variant]: variant,
    className: cx(
      '[--scroller-items-gutter:theme(spacing.4)]',
      '[--scroller-edge-gutter:0px]',
      '[--scroller-item-align:start]',
      '[--scroller-cols:calc((100%-(var(--scroller-visible-items)-1)*var(--scroller-items-gutter))_/_var(--scroller-visible-items))]',
      'data-scrollbar-hidden:scrollbar-hidden',
      'data-[variant=inset]:[--scroller-edge-gutter:max(var(--layout-padding-inline-start),calc(var(--layout-padding-inline-start)+(100vw-var(--layout-max-width))/2))]',
      'relative grid snap-always scroll-px-(--scroller-edge-gutter) auto-cols-(--scroller-cols) grid-flow-col gap-(--scroller-items-gutter) overflow-x-auto overflow-y-hidden overscroll-x-contain px-(--scroller-edge-gutter) outline-none not-data-animation:snap-x not-data-animation:snap-mandatory motion-safe:scroll-smooth',
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
