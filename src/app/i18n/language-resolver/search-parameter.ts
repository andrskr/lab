import type { LanguageResolver } from './language-resolver';

/** Default value for the search parameter key, if not specified in the options. */
const DEFAULT_SEARCH_PARAM_KEY = 'lng';

/** Options for the search parameters resolver. */
interface SearchParameterResolverOptions {
  /**
   * The key of the search parameter that contains the language identifier. If not specified, the
   * resolver will use the default key ({@link DEFAULT_SEARCH_PARAM_KEY}).
   *
   * @example
   *   https://example.com/?lang=en
   *
   *   // In this case, the search parameter key is 'lang'.
   */
  key?: string;
}

/** Resolves the user's language preference from a search parameter in the request URL. */
export class SearchParameterResolver implements LanguageResolver {
  constructor(private readonly options: SearchParameterResolverOptions) {}

  resolve(request: Request) {
    const url = new URL(request.url);
    const key = this.options.key ?? DEFAULT_SEARCH_PARAM_KEY;

    if (!url.searchParams.has(key)) {
      return null;
    }

    return url.searchParams.get(key);
  }
}
