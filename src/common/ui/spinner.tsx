import { cx } from '~/common/lib/cx';
import { Icon } from '~/common/ui/icon';
import { Loader } from '~/common/ui/icons';

export namespace Spinner {
  export interface Props extends Omit<Icon.Props, 'render'> {}
}

export function Spinner(props: Spinner.Props) {
  const { className, ...restProps } = props;

  return <Icon render={<Loader className={cx('animate-spin', className)} {...restProps} />} />;
}
