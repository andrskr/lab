import { Meta as RouterMeta } from 'react-router';

import { ThemeColor } from './theme-color';
import { Viewport } from './viewport';

export function Meta() {
  return (
    <>
      <meta charSet="utf-8" />
      <Viewport />
      <ThemeColor />
      <RouterMeta />
    </>
  );
}
