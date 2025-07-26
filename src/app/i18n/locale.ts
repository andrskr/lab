import { z } from 'zod/mini';

/** The [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt) language code for the locale. */
export const LocaleSchema = z.string().brand('Locale');

/** @see {@link LocaleSchema} */
export type Locale = z.infer<typeof LocaleSchema>;
