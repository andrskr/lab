import type { SetOptional } from '~/common/lib/set-optional';
import { useMergeRefs } from '~/common/lib/use-merge-refs';

import { useRootContext } from '../root/root-context';

import { Navigator } from './navigator';

export namespace Previous {
  export interface Props extends SetOptional<Navigator.Props, 'target'> {}
}

export function Previous(props: Previous.Props) {
  const { ref, target = 'start', options, disabled, ...restProps } = props;
  const { align = 'end', ...restOptions } = options ?? {};

  const { canGoToPrevious, previousTrigger } = useRootContext();
  const effectiveRef = useMergeRefs(ref, previousTrigger);
  const isDisabled = disabled ?? !canGoToPrevious;

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
