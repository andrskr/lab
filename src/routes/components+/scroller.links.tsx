import type { ComponentProps, ReactElement } from 'react';
import { Link as RouterLink } from 'react-router';

import { cx } from '~/common/lib/cx';
import { Button } from '~/common/ui/button';
import { Fader } from '~/common/ui/fader';
import { Icon } from '~/common/ui/icon';
import {
  Radio,
  Activity,
  Airplay,
  AudioLines,
  Fingerprint,
  KeySquare,
  QrCode,
  Rss,
  ScanFace,
  ShieldPlus,
} from '~/common/ui/icons';
import { Scroller } from '~/common/ui/scroller';

/* eslint-disable @eslint-react/no-missing-key */
const icons = [
  <Airplay />,
  <AudioLines />,
  <Radio />,
  <Activity />,
  <Fingerprint />,
  <ScanFace />,
  <KeySquare />,
  <ShieldPlus />,
  <QrCode />,
  <Rss />,
];
/* eslint-enable @eslint-react/no-missing-key */

const labels = [
  'Lorem Ipsum',
  'Dolor Sit',
  'Consectetur Adipiscing',
  'Sed Do',
  'Eiusmod Tempor',
  'Ut Labore',
  'Et Dolore',
  'Magna Aliqua',
  'Enim Ad',
  'Minim Veniam',
  'Quis Nostrud',
  'Exercitation Ullamco',
  'Laboris Nisi',
  'Aliquip Ex',
  'Ea Commodo',
  'Duis Aute',
  'Irure Dolor',
  'Reprehenderit Voluptate',
  'Velit Esse',
  'Cillum Dolore',
];

const items = Array.from({ length: 20 }, (_, index) => index).map((current) => ({
  id: current,
  label: labels[current % labels.length],
  icon: icons[current % icons.length],
}));

export namespace Link {
  export interface Props extends Omit<ComponentProps<typeof RouterLink>, 'children'> {
    label: string;
    icon: ReactElement<Record<string, unknown>>;
  }
}

function Link(props: Link.Props) {
  const { className, label, icon, ...restProps } = props;
  return (
    <Button
      shape="rounded"
      appearance="outline"
      render={
        <RouterLink className={cx(className)} {...restProps}>
          <Icon render={icon} />
          {label}
        </RouterLink>
      }
    />
  );
}

export default function ScrollerLinks() {
  return (
    <div className="container">
      <h2 className="pt-4 pb-7 text-2xl font-bold">Overlay Scroller with Fade</h2>
      <Scroller.Root>
        <div className="relative">
          <Scroller.Track variant="normal">
            {items.map((current) => (
              <Scroller.Item key={current.id}>
                <Link to="." label={current.label} icon={current.icon} />
              </Scroller.Item>
            ))}
          </Scroller.Track>
          <Fader side="left" stop="50%" blur="4px" />
          <Fader side="right" stop="50%" blur="4px" />
        </div>
      </Scroller.Root>
    </div>
  );
}
