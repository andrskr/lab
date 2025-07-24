import type { LinguiConfig } from '@lingui/conf';

import type { Locale } from './locale';

export const DEFAULT_LOCALE = 'en-US' as Locale;

export const config: LinguiConfig = {
  fallbackLocales: {
    default: DEFAULT_LOCALE,
  },
  locales: [DEFAULT_LOCALE, 'pt-PT'],
  catalogs: [
    {
      path: '<rootDir>/src/app/i18n/locales/{locale}',
      include: ['src'],
    },
  ],
};
