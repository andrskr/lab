import { createCookie } from 'react-router';

import { loadCatalog } from './catalog';
import { config, DEFAULT_LOCALE } from './config';
import type { LanguageDetectorOptions } from './language-detector';
import { LanguageDetector } from './language-detector';

interface I18nServerOptions {
  detection: LanguageDetectorOptions;
}

class I18nServer {
  private languageDetector: LanguageDetector;

  constructor(private options: I18nServerOptions) {
    this.languageDetector = new LanguageDetector(options.detection);
  }

  public async getLocale(request: Request) {
    return this.languageDetector.detect(request);
  }
}

/**
 * TODO: add secrets
 *
 * @see https://remix.run/docs/en/main/utils/cookies#signing-cookies TODO: maybe typed cookies?
 * @see https://github.com/sergiodxa/remix-utils#typed-cookies
 */
export const localeCookie = createCookie('lng', {
  path: '/',
  sameSite: 'lax',
  /** TODO: better env management */
  secure: import.meta.env.NODE_ENV === 'production',
  httpOnly: true,
});

export const i18nServer = new I18nServer({
  detection: {
    cookie: localeCookie,
    supportedLanguages: config.locales,
    fallbackLanguage: config.fallbackLocales
      ? (config.fallbackLocales.default ?? DEFAULT_LOCALE)
      : DEFAULT_LOCALE,
  },
});

export async function loadServerCatalog(request: Request) {
  const locale = await i18nServer.getLocale(request);

  await loadCatalog(locale);
}

/**
 * TODO: more generic? We'll have more functions like this (retrieve data from the server using the
 * same pattern).
 */
interface BootstrapReturn<TData> {
  data: TData;
  init?: ResponseInit;
}

export async function getI18nBootstrap(request: Request) {
  const locale = await i18nServer.getLocale(request);

  return {
    data: {
      locale,
    },
    init: {
      headers: {
        'set-cookie': await localeCookie.serialize(locale),
      },
    },
  } satisfies BootstrapReturn<{ locale: string }>;
}
