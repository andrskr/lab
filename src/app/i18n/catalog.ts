import { i18n } from '@lingui/core';
import { detect, fromHtmlTag } from '@lingui/detect-locale';
import { useRouteLoaderData } from 'react-router';

import { DEFAULT_LOCALE } from './config';

/**
 * Ensures that respective locale catalog is loaded on the client side.
 *
 * It needs to be called in the root component of the application (like `Layout` in react-router).
 */

export function useSyncLocaleCatalog() {
  /** FIXME: better type-safe way to get locale from loader data? */
  const rootData = useRouteLoaderData<{ locale?: string }>('root');
  const locale = rootData?.locale ?? DEFAULT_LOCALE;

  if (i18n.locale !== locale) {
    void loadCatalog(locale);
  }

  return locale;
}

type Messages = Record<string, string>;

export async function loadCatalog(locale: string) {
  const { messages } = (await import(`./locales/${locale}.po`)) as { messages: Messages };

  i18n.loadAndActivate({
    locale,
    messages,
  });
}

export async function loadClientCatalog() {
  const locale = detect(fromHtmlTag('lang')) ?? DEFAULT_LOCALE;

  /**
   * TODO:
   *
   * - If the detected locale for some reason is not what we expect (loader failed and it didn't set
   *   the language tag), there is a possibility that we won't have the catalog for that locale and
   *   it will throw an error.
   */
  await loadCatalog(locale);
}
