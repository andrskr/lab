// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DistributiveOmit<TDestination, TSource> = TDestination extends any
  ? Omit<TDestination, keyof TSource>
  : never;
