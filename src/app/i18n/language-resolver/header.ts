import { parseAcceptLanguage } from 'intl-parse-accept-language';

import type { LanguageResolver } from './language-resolver';

export type Locales = string | string[] | undefined;

/**
 * Extracts headers from a Request or returns the headers object.
 *
 * @example
 *   const headers = getHeaders(request);
 *
 *   // or
 *   const headers = getHeaders(request.headers);
 *
 * @param requestOrHeaders - Request or Headers object.
 * @returns Headers object.
 */
function getHeaders(requestOrHeaders: Request | Headers): Headers {
  if (requestOrHeaders instanceof Request) {
    return requestOrHeaders.headers;
  }

  return requestOrHeaders;
}

/**
 * @param requestOrHeaders - Request or Headers object.
 * @returns An array of locale strings, sorted by quality (at least the `intl-parse-accept-language`
 *   says so), given the string from an HTTP Accept-Language header.
 */
export function getClientLocales(requestOrHeaders: Request | Headers): Locales {
  const headers = getHeaders(requestOrHeaders);

  const acceptLanguage = headers.get('Accept-Language');

  if (!acceptLanguage) {
    return undefined;
  }

  const locales = parseAcceptLanguage(acceptLanguage, {
    validate: (locale) => Intl.DateTimeFormat.supportedLocalesOf(locale),
    ignoreWildcard: true,
  });

  if (locales.length === 0) {
    return undefined;
  }

  if (locales.length === 1) {
    return locales[0];
  }

  return locales;
}

export class HeaderResolver implements LanguageResolver {
  resolve(request: Request) {
    const locales = getClientLocales(request);

    if (locales === undefined) {
      return null;
    }

    if (Array.isArray(locales)) {
      return locales.join(',');
    }

    return locales;
  }
}
