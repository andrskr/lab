import { useCallback } from 'react';

import { mergeProps } from '~/common/lib/merge-props';
import { useLatestRef } from '~/common/lib/use-latest-ref';
import { useRender } from '~/common/lib/use-render';
import { Button } from '~/common/ui/button';

import type { NavigateOptions, NavigateTarget } from '../root/root-context';
import { useRootContext } from '../root/root-context';

type NavigatorComponent = typeof Button;

export namespace Navigator {
  export interface Props extends useRender.ComponentProps<NavigatorComponent> {
    target: NavigateTarget;
    options?: NavigateOptions;
  }
}

export function Navigator(props: Navigator.Props) {
  const { render = <Button />, target, options, ...restProps } = props;

  const latestOptions = useLatestRef(options);
  const latestTarget = useLatestRef(target);
  const { navigate } = useRootContext();

  const handleClick = useCallback(() => {
    navigate(latestTarget.current, latestOptions.current);
  }, [navigate, latestTarget, latestOptions]);

  const defaultProps: useRender.ElementProps<NavigatorComponent> = {
    onClick: handleClick,
  };

  const element = useRender({
    render,
    props: mergeProps<NavigatorComponent>(defaultProps, restProps),
  });

  return element;
}
