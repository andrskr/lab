import appleTouchIcon from './apple-touch-icon.png?url&no-inline';
import faviconIco from './favicon.ico?url&no-inline';
import faviconSvg from './favicon.svg?url&no-inline';

export function Favicon() {
  return (
    <>
      <link rel="apple-touch-icon" href={appleTouchIcon} />
      <link rel="icon" sizes="32x32" href={faviconIco} />
      <link rel="icon" type="image/svg+xml" href={faviconSvg} />
    </>
  );
}
