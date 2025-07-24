import type { EffectCallback } from 'react';
import { useEffect } from 'react';

const EMPTY = [] as unknown[];

export function useOnMount(effectCallback: EffectCallback) {
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(effectCallback, EMPTY);
  /* eslint-enable react-hooks/exhaustive-deps */
}
