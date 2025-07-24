import type { Context } from 'react';

/**
 * Get the value type of the provided context.
 *
 * @example
 *   type ContextValue = { foo: string };
 *   const Context = createContext<ContextValue>({ foo: 'bar' });
 *   type ContextValueType = ContextValue<typeof Context>;
 *   // ContextValueType is { foo: string }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContextValue<TContext extends Context<any>> =
  TContext extends Context<infer U> ? U : never;
