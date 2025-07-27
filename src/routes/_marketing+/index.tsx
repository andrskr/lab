import { useConveyer } from '@egjs/react-conveyer';
import { useRef, useState } from 'react';
import { dataAttribute } from '~/common/lib/dom';

export default function Index() {
  const ref = useRef<HTMLDivElement>(null);
  const [isScrollActive, setIsScrollActive] = useState(false);
  const animationScrollActive = useRef(false);

  const {
    // reactive properties
    isReachStart,
    isReachEnd,
    // methods
    scrollIntoView,
    // events
    onBeginScroll,
    onFinishScroll,
  } = useConveyer(ref, {
    horizontal: true,
    itemSelector: '[data-item]',
    useResizeObserver: true,
  });

  onBeginScroll(() => {
    setIsScrollActive(true);
  }, []);
  onFinishScroll((event) => {
    if (event.isAnimationScroll) {
      animationScrollActive.current = false;
    }
    setIsScrollActive(false);
  }, []);

  return (
    <div>
      <div
        ref={ref}
        data-animation={dataAttribute(isScrollActive && animationScrollActive.current)}
        className="grid h-[400px] snap-always scroll-px-[100px] grid-flow-col overflow-x-auto overflow-y-hidden overscroll-contain not-data-animation:snap-x not-data-animation:snap-mandatory before:block before:min-w-[100px] after:block after:min-w-[100px] motion-safe:scroll-smooth"
      >
        <div className="grid h-full min-w-fit grid-flow-col gap-4">
          {Array.from({ length: 20 }, (_, index) => index).map((item) => (
            <div
              key={item}
              data-item=""
              className="grid h-full min-w-[300px] snap-start place-content-center rounded-md border"
            >
              <span className="text-lg font-semibold">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          type="button"
          disabled={isReachStart}
          onClick={() => {
            animationScrollActive.current = true;
            scrollIntoView('start', {
              align: 'end',
              intersection: true,
            });
          }}
        >
          Previous
        </button>
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          type="button"
          disabled={isReachEnd}
          onClick={() => {
            animationScrollActive.current = true;

            scrollIntoView('end', {
              align: 'start',
              intersection: true,
            });
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
