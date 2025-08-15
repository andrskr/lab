import { t } from '@lingui/core/macro';
import type { ComponentProps } from 'react';
import { Link } from 'react-router';

import { cx } from '~/common/lib/cx';
import { Button } from '~/common/ui/button';
import { Icon } from '~/common/ui/icon';
import { ChevronRight, ChevronLeft } from '~/common/ui/icons';
import { Scroller } from '~/common/ui/scroller';

const items = Array.from({ length: 20 }, (_, index) => index).map((current) => ({
  count: current,
  title: 'Lorem ipsum dolor sit.',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
}));

export namespace Card {
  export interface Props extends Omit<ComponentProps<typeof Link>, 'children'> {
    count: number;
    title: string;
    description: string;
  }
}

function Card(props: Card.Props) {
  const { className, count, title, description, ...restProps } = props;
  return (
    <Link
      className={cx(
        'group bg-subtle ease-out-quad relative isolate flex aspect-336/469 w-[336px] cursor-pointer flex-col justify-between overflow-hidden rounded-[30px] px-6 py-8 text-left no-underline outline-offset-2 transition-[filter] duration-200 hover:brightness-105',
        className,
      )}
      {...restProps}
    >
      <div className="text-7xl text-white">{count}</div>
      <div className="absolute inset-0 -z-1">
        <img
          src={''}
          alt=""
          crossOrigin="anonymous"
          loading="lazy"
          width="336"
          height="469"
          decoding="async"
          className="size-full object-cover"
        />

        <div
          className={cx(
            'pointer-events-none absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-[#313f2d] blur-md',
          )}
          aria-hidden="true"
        />

        <div
          className={cx(
            'pointer-events-none absolute bottom-0 left-0 h-1/3 w-full bg-gradient-to-t from-[#313f2d]',
            'ease-out-quad transition-[height] duration-200',
            'group-hover:h-1/2',
          )}
          aria-hidden="true"
        />
      </div>

      <div className="flex items-end justify-between gap-5">
        <div className="flex flex-col gap-1 text-white">
          <h3 className="text-xs">{title}</h3>
          <p className="text-sm text-balance">{description}</p>
        </div>
        <Button className="text-white" appearance="outline" shape="circle" render={<div />}>
          <Icon render={<ChevronRight />} />
        </Button>
      </div>
    </Link>
  );
}

export default function ScrollerApple() {
  return (
    <div>
      <div className="container">
        <h1 className="py-4 text-2xl font-semibold">Get to know Scroller.</h1>
      </div>
      <Scroller.Root>
        <Scroller.Track className="py-1 [--scroller-items-gutter:theme(spacing.2)]">
          {items.map((current) => (
            <Scroller.Item key={current.count}>
              <Card to="." {...current} />
            </Scroller.Item>
          ))}
        </Scroller.Track>

        <div className="flex justify-center gap-4 py-2">
          <Scroller.Previous appearance="soft" shape="circle" size="large">
            <Icon aria-label={t`Go to previous`} render={<ChevronLeft />} />
          </Scroller.Previous>

          <Scroller.Next appearance="soft" shape="circle" size="large">
            <Icon aria-label={t`Go to next`} render={<ChevronRight />} />
          </Scroller.Next>
        </div>
      </Scroller.Root>
    </div>
  );
}
