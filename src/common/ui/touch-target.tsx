import type { ReactNode } from 'react';

export namespace TouchTarget {
  export interface Props {
    children: ReactNode;
  }
}

export function TouchTarget(props: TouchTarget.Props) {
  return (
    <>
      <span
        className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
        aria-hidden="true"
      />
      {props.children}
    </>
  );
}
