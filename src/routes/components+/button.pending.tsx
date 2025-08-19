import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useState } from 'react';

import { dataAttribute } from '~/common/lib/dom';
import { useTimeout } from '~/common/lib/use-timeout';
import { Button } from '~/common/ui/button';
import { Spinner } from '~/common/ui/spinner';

type State = 'idle' | 'pending' | 'success';

const animationVariants = {
  initial: { opacity: 0, y: '-100%' },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: '100%' },
};

export default function ButtonPending() {
  const [state, set] = useState<State>('idle');
  const idleTimer = useTimeout();

  const rotateState = useCallback(() => {
    idleTimer.clear();

    set('pending');

    idleTimer.start(2000, () => {
      set('idle');
    });
  }, [idleTimer]);

  return (
    <main className="py-layout-block container">
      <h1 className="text-2xl font-bold">Pending Button</h1>
      <p>
        This example demonstrates a button that transitions between pending and idle states. When
        clicked, it shows a spinner for 2 seconds before returning to the idle state.
      </p>

      <div className="py-layout-block grid place-content-center">
        <Button onClick={rotateState}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={state}
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                type: 'spring',
                bounce: 0,
                duration: 0.25,
              }}
              className="relative"
            >
              <span
                data-pending={dataAttribute(state === 'pending')}
                className="ease-out-quad opacity-100 transition-opacity duration-200 data-pending:opacity-0"
              >
                Click Me
              </span>
              {state === 'pending' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spinner />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>
    </main>
  );
}
