import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import type { Merge } from 'type-fest';

import type { ContextValue } from '~/common/lib/context-value';
import type { VariantProps } from '~/common/lib/cx';
import { cva } from '~/common/lib/cx';
import { IconContext } from '~/common/ui/icon';

import { mergeProps } from '../lib/merge-props';
import { useRender } from '../lib/use-render';

const DEFAULT_SIZE = 'medium';

const buttonStyles = cva({
  base: [
    'ease-out-quad inline-flex cursor-pointer items-center justify-center gap-x-2 rounded-md border font-medium outline outline-0 outline-offset-2 outline-(--button-bg) transition-colors focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50',
  ],
  variants: {
    variant: {
      primary: [
        '[--button-bg:var(--color-primary)]',
        '[--button-fg:var(--color-primary-foreground)]',
        'inset-shadow-primary-foreground/20 enabled:hover:inset-shadow-primary-foreground/30 active:inset-shadow-primary-foreground/20',
      ],
    },
    appearance: {
      solid: [
        'border-(--button-bg) bg-(--button-bg) text-(--button-fg) inset-shadow-sm inset-ring inset-ring-(--button-bg)',
        'enabled:hover:border-(--button-bg)/92 enabled:hover:bg-(--button-bg)/92',
        'focus-visible:border-(--button-bg)/92 focus-visible:bg-(--button-bg)/92',
        'active:border-(--button-bg) active:bg-(--button-bg)',
      ],
      outline: null,
      plain: null,
      soft: [
        'bg-(--button-bg)/10',
        'enabled:hover:bg-(--button-bg)/15',
        'active:bg-(--button-bg)/20',
      ],
    },
    shape: {
      square: 'rounded-lg',
      circle: 'rounded-full',
      rounded: 'rounded-full',
    },
    size: {
      small: 'px-3.5 py-1.5 text-xs',
      [DEFAULT_SIZE]: 'px-4 py-2.25 text-sm',
      large: 'px-4.5 py-3 text-base',
    },
  },
  compoundVariants: [
    {
      appearance: ['outline', 'plain', 'soft'],
      className: 'text-(--button-bg)',
    },
    {
      appearance: ['outline', 'plain'],
      className: [
        'enabled:hover:bg-(--button-bg)/10',
        'active:bg-(--button-bg)/15',
        'aria-expanded:bg-(--button-bg)/10',
      ],
    },
    {
      appearance: ['plain', 'soft'],
      className: 'border-none',
    },
    {
      shape: 'circle',
      size: 'small',
      className: 'p-2',
    },
    {
      shape: 'circle',
      size: DEFAULT_SIZE,
      className: 'p-2.25',
    },
    {
      shape: 'circle',
      size: 'large',
      className: 'p-2.5',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    appearance: 'solid',
    shape: 'square',
    size: DEFAULT_SIZE,
  },
});

type IconProps = ContextValue<typeof IconContext>;

const iconSizeMap = {
  small: 14,
  medium: 16,
  large: 24,
} satisfies Record<NonNullable<ButtonVariant['size']>, number>;

type ButtonElement = 'button';
type ButtonRenderProps = Pick<ComponentProps<ButtonElement>, 'className'>;
type ButtonVariant = VariantProps<typeof buttonStyles>;
type ButtonComponentProps = useRender.ComponentProps<ButtonElement, never, ButtonRenderProps>;

export namespace Button {
  export interface Props extends Merge<ButtonComponentProps, ButtonVariant> {}
}

export function Button(props: Button.Props) {
  const {
    className,
    variant,
    appearance,
    size = DEFAULT_SIZE,
    shape,
    render,
    ...restProps
  } = props;

  const element = useRender({
    render: render ?? <button type="button" />,
    props: mergeProps<ButtonElement>(restProps, {
      className: buttonStyles({
        variant,
        appearance,
        size,
        shape,
        className,
      }),
    }),
  });

  const iconContextValue: IconProps = useMemo(() => {
    return {
      size: iconSizeMap[size],
      className: 'shrink-0',
    };
  }, [size]);

  return <IconContext value={iconContextValue}>{element}</IconContext>;
}
