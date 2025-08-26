import { Dialog, ScrollArea } from '@base-ui-components/react';
import { AnimatePresence, motion } from 'motion/react';
import type { ComponentProps } from 'react';
import { useRef, useState } from 'react';
import type { IterableElement } from 'type-fest';

import { cx } from '~/common/lib/cx';
import { Button } from '~/common/ui/button';
import { Icon } from '~/common/ui/icon';
import { ChevronRight, ChevronLeft, Plus, X } from '~/common/ui/icons';
import { Scroller } from '~/common/ui/scroller';

import placeholder from './placeholder.webp';

const items = Array.from({ length: 20 }, (_, index) => index).map((current) => ({
  count: current,
  title: 'Lorem ipsum dolor sit.',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
}));

export namespace Card {
  export interface Props extends Omit<ComponentProps<typeof motion.button>, 'children'> {
    count: number;
    title: string;
    description: string;
  }
}

const MotionButton = motion.create(Button);

function Card(props: Card.Props) {
  const { className, count, title, description, ...restProps } = props;

  return (
    <motion.button
      tabIndex={0}
      layoutId={`card-${String(count)}`}
      style={{
        borderRadius: '30px',
      }}
      className={cx(
        'group bg-subtle ease-out-quad relative isolate flex aspect-336/469 w-[336px] cursor-pointer flex-col justify-between overflow-hidden px-6 py-8 text-left no-underline outline-offset-2 transition-[filter] duration-200 hover:brightness-105',
        className,
      )}
      {...restProps}
    >
      <MotionButton
        tabIndex={-1}
        aria-hidden="true"
        layoutId={`close-${String(count)}`}
        className="absolute top-6 right-6"
        appearance="soft"
        shape="circle"
        style={{
          opacity: 0,
        }}
        render={<div />}
      >
        <Icon aria-label="Close dialog" render={<X />} />
      </MotionButton>

      <motion.div
        layout="position"
        layoutId={`count-${String(count)}`}
        className="text-7xl text-white"
      >
        {count}
      </motion.div>
      <div className="absolute inset-0 -z-1">
        <motion.img
          layoutId={`image-${String(count)}`}
          src={placeholder}
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
          <motion.h3 layoutId={`title-${String(count)}`} className="text-xs">
            {title}
          </motion.h3>
          <motion.p layoutId={`description-${String(count)}`} className="text-sm text-balance">
            {description}
          </motion.p>
        </div>
        <Button className="text-white" appearance="outline" shape="circle" render={<div />}>
          <Icon render={<Plus />} />
        </Button>
      </div>
    </motion.button>
  );
}

export default function ScrollerExample() {
  const [activeCard, setActiveCard] = useState<IterableElement<typeof items> | null>(null);
  const currentTrigger = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <div className="container">
        <h1 className="py-4 text-2xl font-semibold">
          Explore the endless possibilities of shared layouts.
        </h1>
      </div>
      <Scroller.Root>
        <Scroller.Track className="py-4 [--scroller-items-gutter:theme(spacing.2)]">
          {items.map((current) => (
            <Scroller.Item key={current.count}>
              <Card
                {...current}
                onClick={(event) => {
                  currentTrigger.current = event.currentTarget;
                  setActiveCard(current);
                }}
              />
            </Scroller.Item>
          ))}
        </Scroller.Track>

        <div className="flex justify-center gap-4 py-2">
          <Scroller.Previous appearance="soft" shape="circle" size="large">
            <Icon aria-label="Go to previous" render={<ChevronLeft />} />
          </Scroller.Previous>

          <Scroller.Next appearance="soft" shape="circle" size="large">
            <Icon aria-label="Go to next" render={<ChevronRight />} />
          </Scroller.Next>
        </div>
      </Scroller.Root>

      <Dialog.Root
        open={!!activeCard}
        onOpenChange={() => {
          setActiveCard(null);
        }}
      >
        <AnimatePresence>
          {activeCard ? (
            <Dialog.Portal keepMounted>
              <Dialog.Backdrop
                className="bg-subtle/90 fixed inset-0"
                render={
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                }
              />
              <Dialog.Popup
                finalFocus={currentTrigger}
                render={
                  <motion.div
                    layoutId={`card-${String(activeCard.count)}`}
                    className="bg-background inset-ring-subtle fixed inset-[5vh_0_0_0] mx-auto max-w-[760px] overflow-hidden shadow-2xl inset-ring-1 outline-none"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      borderTopLeftRadius: '32px',
                      borderTopRightRadius: '32px',
                    }}
                  />
                }
              >
                <ScrollArea.Root className="h-full">
                  <ScrollArea.Viewport
                    className="h-full overscroll-none outline-none"
                    tabIndex={-1}
                  >
                    <ScrollArea.Content>
                      <Dialog.Close
                        render={
                          <MotionButton
                            layoutId={`close-${String(activeCard.count)}`}
                            className="absolute top-6 right-6"
                            appearance="soft"
                            shape="circle"
                          >
                            <Icon aria-label="Close dialog" render={<X />} />
                          </MotionButton>
                        }
                      />

                      <div className="stack aspect-square">
                        <motion.img
                          layoutId={`image-${String(activeCard.count)}`}
                          src={placeholder}
                          alt=""
                          crossOrigin="anonymous"
                          width="336"
                          height="469"
                          decoding="async"
                          className="size-full object-cover"
                        />

                        <div className="px-layout-inline py-layout-block flex flex-col justify-between text-white">
                          <motion.div
                            layout="position"
                            layoutId={`count-${String(activeCard.count)}`}
                            className="text-shadow-foreground text-7xl text-shadow-xs"
                          >
                            {activeCard.count}
                          </motion.div>
                          <div className="text-shadow-foreground text-shadow-xs">
                            <Dialog.Title
                              render={
                                <motion.h2
                                  layoutId={`title-${String(activeCard.count)}`}
                                  className="pb-2 text-sm text-balance"
                                />
                              }
                            >
                              {activeCard.title}
                            </Dialog.Title>
                            <Dialog.Description
                              render={
                                <motion.p
                                  layoutId={`description-${String(activeCard.count)}`}
                                  className="text-xl leading-snug text-pretty"
                                />
                              }
                            >
                              {activeCard.description}
                            </Dialog.Description>
                          </div>
                        </div>
                      </div>

                      <div className="px-layout-inline py-layout-block">
                        <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 pt-8 pb-10 text-sm">
                          <dt>More powerful than ever</dt>
                          <dd className="text-muted-foreground text-pretty">
                            Performance improvements across the board, from faster load times to
                            smoother interactions.
                          </dd>

                          <dt>Upgraded design</dt>
                          <dd className="text-muted-foreground text-pretty">
                            A fresh new look that combines aesthetics with usability, making it
                            easier to navigate and find what you need.
                          </dd>

                          <dt>Enhanced security</dt>
                          <dd className="text-muted-foreground text-pretty">
                            State-of-the-art security features to protect your data and ensure your
                            privacy.
                          </dd>

                          <dt>Attention to detail</dt>
                          <dd className="text-muted-foreground text-pretty">
                            Every aspect of the product has been meticulously crafted to provide a
                            seamless and enjoyable user experience.
                          </dd>
                        </dl>

                        <p className="text-sm">
                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti quas,
                          perspiciatis ut laborum fugit velit blanditiis nobis iusto voluptatum hic
                          repellendus asperiores eligendi. Modi iste similique, aliquam explicabo
                          molestiae mollitia ipsa et at, autem corrupti reiciendis distinctio
                          consequuntur aspernatur perspiciatis, amet ut vero numquam dignissimos non
                          harum inventore natus quibusdam alias voluptate.
                        </p>

                        <p className="text-sm">
                          Ut laudantium dignissimos cumque et voluptatum labore perspiciatis, a
                          consequatur. Illo hic ratione libero rerum labore ipsa provident, unde
                          recusandae odio ex inventore iste amet. Dolore esse neque error totam,
                          odio necessitatibus quaerat accusantium facilis praesentium, excepturi
                          illo. At a necessitatibus ad earum incidunt cum nulla dolorem molestiae?
                        </p>
                      </div>
                    </ScrollArea.Content>
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar
                    className={cx(
                      'ease-out-quad z-scrollbar bg-primary/20 mx-2 mt-8 mb-1 flex w-1 justify-center rounded-md opacity-0 transition-opacity',
                      'data-hovering:opacity-100 data-hovering:delay-0 data-hovering:duration-75',
                      'data-scrolling:opacity-100 data-scrolling:delay-0 data-scrolling:duration-75',
                      'before:absolute before:h-full before:w-5',
                    )}
                  >
                    <ScrollArea.Thumb className="bg-primary/40 w-full transform-gpu rounded-[inherit]" />
                  </ScrollArea.Scrollbar>
                </ScrollArea.Root>
              </Dialog.Popup>
            </Dialog.Portal>
          ) : null}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}
