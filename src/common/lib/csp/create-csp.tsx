import type { ReactNode } from 'react';

import { NonceContext } from './context';
import type { PolicyBuilderOptions } from './header';
import { createCSPHeader } from './header';
import { generateNonce } from './nonce';

export function createCSP(options?: Partial<PolicyBuilderOptions>) {
  const nonce = generateNonce();
  const header = createCSPHeader(nonce, options);

  const NonceProvider = ({ children }: { children: ReactNode }) => (
    <NonceContext value={nonce}>{children}</NonceContext>
  );

  return { nonce, header, NonceProvider };
}
