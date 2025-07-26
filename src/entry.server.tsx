import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import type { AppLoadContext, EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';

import { loadServerCatalog } from '~/app/i18n/i18n.server';
import { createContentSecurityOptions } from '~/app/security/content-security';
import { generateNonce, NonceProvider } from '~/common/lib/nonce';
import { contentSecurity, generalSecurity } from '~/common/lib/secure-headers';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  generalSecurity(responseHeaders);
  const nonce = generateNonce();
  let shellRendered = false;
  const userAgent = request.headers.get('user-agent');

  await loadServerCatalog(request);

  const body = await renderToReadableStream(
    <NonceProvider nonce={nonce}>
      <I18nProvider i18n={i18n}>
        <ServerRouter context={routerContext} url={request.url} nonce={nonce} />
      </I18nProvider>
    </NonceProvider>,
    {
      nonce,
      onError(error: unknown) {
        responseStatusCode = 500;
        // Log streaming rendering errors from inside the shell.  Don't log
        // errors encountered during initial shell rendering since they'll
        // reject and get logged in handleDocumentRequest.
        if (shellRendered) {
          console.error(error);
        }
      },
    },
  );
  shellRendered = true;

  // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
  // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  contentSecurity(responseHeaders, createContentSecurityOptions(nonce));

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
