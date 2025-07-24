import type { LucideIcon } from 'lucide-react';
import { createContext, use } from 'react';
import type { SetRequired } from 'type-fest';

import { mergeProps } from '../lib/merge-props';
import { useRender } from '../lib/use-render';

type IconElement = LucideIcon;

type IconProps = SetRequired<useRender.ComponentProps<IconElement>, 'render'>;

export const IconContext = createContext<Omit<IconProps, 'render'>>({});
IconContext.displayName = 'IconContext';

const iconDataAttributes = {
  slot: 'data-slot',
};

export function Icon(props: IconProps) {
  const context = use(IconContext);

  const {
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
    ...restProps
  } = mergeProps<IconElement>(context, props);

  const element = useRender({
    render: props.render,
    ref: context.ref,
    props: mergeProps<IconElement>(restProps, {
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
