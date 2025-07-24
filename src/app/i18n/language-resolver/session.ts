import type { SessionStorage } from 'react-router';

import type { LanguageResolver } from './language-resolver';

/** Default value for the session key. */
const DEFAULT_SESSION_KEY = 'lng';

interface SessionResolverOptions {
  /**
   * The session storage to parse the language from. If not specified, the resolver will not attempt
   * to parse the language from a session.
   */
  storage?: SessionStorage;
  /**
   * The key of the session that contains the language identifier. If not specified, the resolver
   * will use the default key ({@link DEFAULT_SESSION_KEY}).
   */
  key?: string;
}

export class SessionResolver implements LanguageResolver {
  constructor(private readonly options: SessionResolverOptions) {}

  async resolve(request: Request) {
    const storage = this.options.storage;
    const key = this.options.key ?? DEFAULT_SESSION_KEY;

    if (!storage) {
      return null;
    }

    const session = await storage.getSession(request.headers.get('Cookie'));

    /**
     * TODO: maybe typed cookies? FIXME: eliminate the need for the `as` assertion
     *
     * @see https://github.com/sergiodxa/remix-utils#typed-cookies
     */
    const language = session.get(key) as string | null | undefined;

    if (!language) {
      return null;
    }

    return language;
  }
}
