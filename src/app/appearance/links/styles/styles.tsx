import interWoff2 from '@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2?url';

import styles from './styles.css?url';

export function Styles() {
  return (
    <>
      <link rel="preload" as="font" href={interWoff2} type="font/woff2" crossOrigin="anonymous" />
      <link rel="stylesheet" href={styles} />
    </>
  );
}
