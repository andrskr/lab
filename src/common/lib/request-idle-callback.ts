export const requestIdleCallback =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  globalThis.requestIdleCallback?.bind(globalThis) ??
  function requestIdleCallback(callback: IdleRequestCallback): ReturnType<typeof setTimeout> {
    const start = Date.now();

    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

export const cancelIdleCallback =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  globalThis.cancelIdleCallback?.bind(globalThis) ??
  function cancelIdleCallback(id: number) {
    clearTimeout(id);
  };
