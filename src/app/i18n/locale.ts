import t from 'zod/mini';

/** The [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt) language code for the locale. */
export const LocaleSchema = t.string().brand('Locale');

/** @see {@link LocaleSchema} */
export type Locale = t.infer<typeof LocaleSchema>;
