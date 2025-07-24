import type { Cookie } from 'react-router';

import type { LanguageResolver } from './language-resolver';

/** Options for the cookie resolver. */
interface CookieResolverOptions {
  /**
   * The cookie object to parse the language from. If not specified, the resolver will not attempt
   * to parse the language from a cookie.
   */
  cookie?: Cookie;
}

/** Resolves the user's language preference from a cookie in the request. */
export class CookieResolver implements LanguageResolver {
  constructor(private readonly options: CookieResolverOptions) {}

  async resolve(request: Request) {
    const cookie = this.options.cookie;

    if (!cookie) {
      return null;
    }

    /**
     * TODO: maybe typed cookies? FIXME: eliminate the need for the `as` assertion
     *
     * @see https://github.com/sergiodxa/remix-utils#typed-cookies
     */
    const language = (await cookie.parse(request.headers.get('Cookie'))) as
      | string
      | null
      | undefined;

    if (typeof language !== 'string' || !language) {
      return null;
    }

    return language;
  }
}
