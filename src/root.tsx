import type { ReactNode } from 'react';
import { data, isRouteErrorResponse, Outlet, Scripts, ScrollRestoration } from 'react-router';

import { Links } from '~/app/appearance/links';
import { Meta } from '~/app/appearance/meta';
import { useSyncLocaleCatalog } from '~/app/i18n/catalog';
import { getI18nBootstrap } from '~/app/i18n/i18n.server';
import { useNonce } from '~/common/lib/csp';

import type { Route } from './+types/root';

/** TODO: move it somewhere else? */
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const i18nInit = await getI18nBootstrap(request);

  return data(
    {
      ...i18nInit.data,
    },
    i18nInit.init,
  );
}

function Document({ children }: { children: ReactNode }) {
  const locale = useSyncLocaleCatalog();
  const nonce = useNonce();

  /** TODO: direction */

  return (
    <html lang={locale}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return <Document>{children}</Document>;
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
