import type { SetOptional } from '~/common/lib/set-optional';
import { useMergeRefs } from '~/common/lib/use-merge-refs';

import { useRootContext } from '../root/root-context';

import { Navigator } from './navigator';

export namespace Next {
  export interface Props extends SetOptional<Navigator.Props, 'target'> {}
}

export function Next(props: Next.Props) {
  const { ref, target = 'end', options, disabled, ...restProps } = props;
  const { align = 'start', ...restOptions } = options ?? {};

  const { canGoToNext, nextTrigger } = useRootContext();
  const effectiveRef = useMergeRefs(ref, nextTrigger);
  const isDisabled = disabled ?? !canGoToNext;

  return (
    <Navigator
      ref={effectiveRef}
      target={target}
      options={{ align, ...restOptions }}
      disabled={isDisabled}
      {...restProps}
    />
  );
}
