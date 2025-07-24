// import type { ClassValue } from 'clsx';
// import { clsx } from 'clsx';
// import { twMerge } from 'tailwind-merge';
//
// export function cn(...values: ClassValue[]): string {
//   return twMerge(clsx(values));
// }

import { defineConfig } from 'cva';
import { twMerge } from 'tailwind-merge';

export type { VariantProps } from 'cva';

export const { cva, cx, compose } = defineConfig({
  hooks: {
    /**
     * Merges a string of completed classes or classNames using the twMerge function.
     *
     * This function takes a string of classes or classNames, which are assumed to be resolved by
     * CVA first, and merges them into a single string using the twMerge function. The resulting
     * string can be used to apply multiple classes to a single HTML element.
     *
     * @param className - A string of completed classes or classNames, separated by spaces.
     * @returns - A single string of classes or classNames, merged by the twMerge function.
     */
    onComplete: (className) => twMerge(className),
  },
});
