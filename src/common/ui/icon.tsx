import type { LucideIcon } from 'lucide-react';
import { createContext, use } from 'react';
import type { SetRequired } from 'type-fest';

import { mergeProps } from '../lib/merge-props';
import { useRender } from '../lib/use-render';

type IconElement = LucideIcon;

export namespace Icon {
  export interface Props extends SetRequired<useRender.ComponentProps<IconElement>, 'render'> {}
}

export const IconContext = createContext<Omit<Icon.Props, 'render'>>({});
IconContext.displayName = 'IconContext';

const iconDataAttributes = {
  slot: 'data-slot',
};

export function Icon(props: Icon.Props) {
  const { render, ...restProps } = props;
  const context = use(IconContext);

  const {
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
    ...mergedProps
  } = mergeProps<IconElement>(context, restProps);

  const element = useRender({
    render,
    ref: context.ref,
    props: mergeProps<IconElement>(mergedProps, {
      focusable: 'false',
      'aria-label': ariaLabel,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      'aria-hidden': ariaLabel ? ariaHidden || undefined : true,
      role: 'img',
      [iconDataAttributes.slot]: 'icon',
    }),
  });

  return element;
}
