import { createContext, use } from 'react';

import type { Nonce } from './nonce';

export const NonceContext = createContext<Nonce | undefined>(undefined);
NonceContext.displayName = 'NonceContext';

export function useNonce() {
  return use(NonceContext);
}
