import { isDevelopment } from '~/common/env';
import type { Nonce } from '~/common/lib/nonce';
import type { ContentSecureOptions } from '~/common/lib/secure-headers';

export function createContentSecurityOptions(nonce: Nonce): ContentSecureOptions {
  const nonceString = `'nonce-${nonce}'`;

  const options: ContentSecureOptions = {
    contentSecurityPolicy: {
      directives: {
        document: {
          'base-uri': ["'self'"],
        },
        fetch: {
          'default-src': ["'self'", nonceString],
          'script-src': [
            "'strict-dynamic'",
            "'self'",
            nonceString,
            ...(isDevelopment ? ['http://localhost:*'] : []),
          ],
          'style-src': [
            "'self'",
            "'unsafe-inline'",
            ...(isDevelopment ? ['http://localhost:*'] : []),
          ],
          'img-src': ["'self'", 'data:'],
          'connect-src': [
            "'self'",
            ...(isDevelopment
              ? ['http://localhost:*', 'ws://localhost:*', 'ws://127.0.0.1:*']
              : []),
          ],
        },
        navigation: {
          'frame-ancestors': ["'none'"],
        },
      },
    },
  } satisfies ContentSecureOptions;

  return options;
}
