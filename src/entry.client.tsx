import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

import { loadClientCatalog } from '~/app/i18n/catalog';

async function run() {
  /** TODO: error handling? */

  await loadClientCatalog();

  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <I18nProvider i18n={i18n}>
          <HydratedRouter />
        </I18nProvider>
      </StrictMode>,
    );
  });
}

void run();
