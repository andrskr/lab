import { useMemo } from 'react';

import { cx } from '~/common/lib/cx';
import { dataAttribute } from '~/common/lib/dom';
import { mergeProps } from '~/common/lib/merge-props';
import { useInView } from '~/common/lib/use-in-view';
import { useRender } from '~/common/lib/use-render';

import { useRootContext } from '../root/root-context';

type ItemComponent = 'div';

export namespace Item {
  export interface State {
    visible: boolean;
  }

  export interface Props extends useRender.ComponentProps<ItemComponent, State> {}
}

/** The minimum intersection ratio for an item to be considered visible. */
const VIEW_TOLERANCE = 0.5;
const itemDataAttributes = {
  item: 'data-scroller-item',
  visible: 'data-visible',
};

export function Item(props: Item.Props) {
  const { render = <div />, className, ...restProps } = props;
  const { trackElement } = useRootContext();
  const { ref, inView, entry } = useInView({
    root: trackElement,
    threshold: [0, VIEW_TOLERANCE, 1],
  });

  const isVisible = inView && (entry?.intersectionRatio ?? 0) > VIEW_TOLERANCE;
  const defaultProps: useRender.ElementProps<ItemComponent> = {
    [itemDataAttributes.item]: '',
    [itemDataAttributes.visible]: dataAttribute(isVisible),
    className: cx(
      '[scroll-snap-align:var(--scroller-item-align,start)]',
      'grid h-full w-[300px] place-content-center border',
      className,
    ),
  };

  const state = useMemo(() => ({ visible: isVisible }) satisfies Item.State, [isVisible]);

  const element = useRender({
    render,
    ref,
    state,
    props: mergeProps<ItemComponent>(defaultProps, restProps),
  });

  return element;
}
