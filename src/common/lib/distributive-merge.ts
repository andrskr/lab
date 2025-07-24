import type { Merge } from 'type-fest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DistributiveMerge<TDestination, TSource> = TDestination extends any
  ? Merge<TDestination, TSource>
  : never;
