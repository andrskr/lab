import { pick } from 'accept-language-parser';
import type { Cookie, SessionStorage } from 'react-router';

import { CookieResolver } from './language-resolver/cookie';
import { HeaderResolver } from './language-resolver/header';
import type { LanguageResolver } from './language-resolver/language-resolver';
import { SearchParameterResolver } from './language-resolver/search-parameter';
import { SessionResolver } from './language-resolver/session';
import type { Locale } from './locale';

/** Defines the options for the language detector. */
export interface LanguageDetectorOptions {
  /**
   * Defines the list of supported languages, this is used to determine if one of the languages
   * requested by the user is supported by the application. This should be same as the locales in
   * the LinguiConfig options.
   */
  supportedLanguages: string[];

  /**
   * Defines the fallback language that it's going to be used in the case user expected language is
   * not supported. This should be same as the fallbackLocales in the LinguiConfig options.
   */
  fallbackLanguage: string;

  /**
   * If you want to use a cookie to store the user preferred language, you can pass the Cookie
   * object here.
   */
  cookie?: Cookie;

  /**
   * If you want to use a session to store the user preferred language, you can pass the
   * SessionStorage object here. When this is not defined, getting the locale will ignore the
   * session.
   */
  sessionStorage?: SessionStorage;

  /**
   * If defined a sessionStorage and want to change the default key used to store the user preferred
   * language, you can pass the key here.
   */
  sessionKey?: string;

  /**
   * If you want to use search parameters for language detection and want to change the default key
   * used to for the parameter name, you can pass the key here.
   */
  searchParamKey?: string;

  /**
   * The order the library will use to detect the user preferred language. If not provided, it will
   * use the default order ({@link DEFAULT_ORDER}).
   */
  order?: ('searchParam' | 'cookie' | 'session' | 'header')[];
}

const DEFAULT_ORDER = [
  'searchParam',
  'cookie',
  'session',
  'header',
] satisfies LanguageDetectorOptions['order'];

/**
 * A language detector is used to determine the user's preferred language based on various sources
 * such as search parameters, cookies, sessions, and headers.
 */
export class LanguageDetector {
  constructor(private options: LanguageDetectorOptions) {
    this.isSessionOnly(options);
    this.isCookieOnly(options);
  }

  /**
   * Ensures the SessionStorage is defined when the session is the only option.
   *
   * @throws When the session is the only option and the sessionStorage is not defined.
   */
  private isSessionOnly(options: LanguageDetectorOptions) {
    if (
      options.order?.length === 1 &&
      options.order[0] === 'session' &&
      options.sessionStorage === undefined
    ) {
      throw new Error(
        'When using the session as the only option, you must define the sessionStorage option.',
      );
    }
  }

  /**
   * Ensures the Cookie is defined when the cookie is the only option.
   *
   * @throws When the cookie is the only option and the cookie is not defined.
   */
  private isCookieOnly(options: LanguageDetectorOptions) {
    if (
      options.order?.length === 1 &&
      options.order[0] === 'cookie' &&
      options.cookie === undefined
    ) {
      throw new Error(
        'When using the cookie as the only option, you must define the cookie option.',
      );
    }
  }

  /**
   * Filters the user's preferred language based on the supported languages.
   *
   * @returns The user's preferred language or the fallback language if the user's preferred
   *   language is not supported.
   */
  private fromSupported(language: string | null) {
    return (
      pick(this.options.supportedLanguages, language ?? this.options.fallbackLanguage, {
        loose: false,
      }) ??
      pick(this.options.supportedLanguages, language ?? this.options.fallbackLanguage, {
        loose: true,
      })
    );
  }

  /**
   * Detects the user's preferred locale based on the options provided.
   *
   * @returns The user's preferred language or the fallback language if it can't determine the
   *   user's preferences.
   */
  public async detect(request: Request) {
    const order = this.options.order ?? DEFAULT_ORDER;

    for (const method of order) {
      let resolver: LanguageResolver | null = null;

      if (method === 'searchParam') {
        resolver = new SearchParameterResolver({
          key: this.options.searchParamKey,
        });
      }

      if (method === 'cookie') {
        resolver = new CookieResolver({
          cookie: this.options.cookie,
        });
      }

      if (method === 'session') {
        resolver = new SessionResolver({
          key: this.options.sessionKey,
          storage: this.options.sessionStorage,
        });
      }

      if (method === 'header') {
        resolver = new HeaderResolver();
      }

      if (!resolver) {
        continue;
      }

      const locale = await resolver.resolve(request);

      if (!locale) {
        continue;
      }

      const supported = this.fromSupported(locale);

      if (!supported) {
        continue;
      }

      return supported as Locale;
    }

    return this.options.fallbackLanguage as Locale;
  }
}
