import type { ComponentProps, CSSProperties } from 'react';

import { cx } from '~/common/lib/cx';

export namespace Fader {
  export interface Props extends Omit<ComponentProps<'div'>, 'children'> {
    stop?: string;
    blur?: string;
    width?: number;
    side: 'left' | 'right';
  }
}

const faderDataAttributes = {
  side: 'data-side',
};

export function Fader(props: Fader.Props) {
  const { stop, blur, width, side, className, style, ...restProps } = props;
  const dataAttributes = {
    [faderDataAttributes.side]: side,
  };

  return (
    <div
      aria-hidden="true"
      className={cx(
        '[--blur:1px]',
        '[--stop:25%]',
        '[--width:120px]',
        '[--color-bg:var(--color-background)]',
        'data-[side=left]:left-0',
        'data-[side=left]:bg-[linear-gradient(to_left,transparent,var(--color-bg))]',
        'data-[side=left]:mask-[linear-gradient(to_right,var(--color-bg)_var(--stop),transparent)]',
        'data-[side=right]:right-0',
        'data-[side=right]:bg-[linear-gradient(to_right,transparent,var(--color-bg))]',
        'data-[side=right]:mask-[linear-gradient(to_left,var(--color-bg)_var(--stop),transparent)]',
        'pointer-events-none absolute top-0 h-full w-(--width) backdrop-blur-(---blur) select-none',
        className,
      )}
      style={
        {
          '--stop': stop,
          '--blur': blur,
          ...(width ? { '--width': `${String(width)}px` } : {}),
          ...style,
        } as CSSProperties
      }
      {...dataAttributes}
      {...restProps}
    />
  );
}
