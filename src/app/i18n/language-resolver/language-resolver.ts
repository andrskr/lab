/** Provides functionality to resolve the user's language preference from various parts of a request. */
export interface LanguageResolver {
  /**
   * Resolves the user's language preference from the request.
   *
   * This method analyzes different parts of the HTTP request, such as headers (e.g.,
   * 'Accept-Language'), search parameters, cookies, session data, etc. to determine the user's
   * preferred language.
   *
   * @param request The request to resolve the language from.
   * @returns Detected language identifier in a form of a string (e.g., 'en-US', 'es-US',
   *   'en-GB,en-US;q=0.9,fr-CA;q=0.7,en;q=0.8'), or null if no language could be detected from the
   *   request.
   */
  resolve: (request: Request) => string | null | Promise<string | null>;
}
