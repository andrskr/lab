import type { ComponentProps } from 'react';
import { Link } from 'react-router';

import { cx } from '~/common/lib/cx';
import { Button } from '~/common/ui/button';
import { Icon } from '~/common/ui/icon';
import { ChevronRight, ChevronLeft, Plus } from '~/common/ui/icons';
import { Scroller } from '~/common/ui/scroller';

import placeholder from './placeholder-1.jpg';

const items = Array.from({ length: 20 }, (_, index) => index).map((current) => ({
  count: current,
  title: 'Lorem ipsum.',
  description: 'Lorem ipsum dolor sit amet, consectetur.',
}));

export namespace Card {
  export interface Props extends Omit<ComponentProps<typeof Link>, 'children'> {
    title: string;
    description: string;
  }
}

function Card(props: Card.Props) {
  const { className, title, description, ...restProps } = props;
  return (
    <Link
      className={cx(
        'group ease-out-quad relative isolate flex aspect-405/740 w-[405px] transform-gpu cursor-pointer flex-col justify-between overflow-hidden rounded-[28px] p-8 text-left no-underline outline-offset-2 transition-transform hover:[scale:1.014_1]',
        className,
      )}
      {...restProps}
    >
      <img
        src={placeholder}
        alt=""
        crossOrigin="anonymous"
        loading="lazy"
        width="336"
        height="469"
        decoding="async"
        className="absolute inset-0 -z-1 size-full transform-gpu object-cover transition-transform group-hover:[scale:1_1.014]"
      />

      <div className="flex flex-col gap-2 text-white">
        <h3>{title}</h3>
        <p className="text-lg leading-tight text-balance">{description}</p>
      </div>

      <div className="flex items-end justify-end gap-5">
        <Button className="text-white" appearance="outline" shape="circle" render={<div />}>
          <Icon render={<Plus />} />
        </Button>
      </div>
    </Link>
  );
}

export default function ScrollerApple() {
  return (
    <div>
      <div className="container">
        <h1 className="py-10 text-2xl font-semibold">Get to know your Tesla.</h1>
      </div>
      <Scroller.Root>
        <Scroller.Track className="py-1 [--scroller-items-gutter:theme(spacing.5)]">
          {items.map((current) => (
            <Scroller.Item key={current.count}>
              <Card to="." {...current} />
            </Scroller.Item>
          ))}
        </Scroller.Track>

        <div className="container flex justify-end gap-4 py-5">
          <Scroller.Previous
            options={{ align: 'start', sibling: -1 }}
            appearance="soft"
            shape="circle"
          >
            <Icon aria-label="Go to previous" render={<ChevronLeft />} />
          </Scroller.Previous>

          <Scroller.Next
            target="start"
            options={{ align: 'start', sibling: 1 }}
            appearance="soft"
            shape="circle"
          >
            <Icon aria-label="Go to next" render={<ChevronRight />} />
          </Scroller.Next>
        </div>
      </Scroller.Root>
    </div>
  );
}
