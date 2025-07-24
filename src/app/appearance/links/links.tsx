import { Links as RouterLinks } from 'react-router';

import { Favicon } from './favicon';
import { Styles } from './styles';

export function Links() {
  return (
    <>
      <Favicon />
      <Styles />
      <RouterLinks />
    </>
  );
}
