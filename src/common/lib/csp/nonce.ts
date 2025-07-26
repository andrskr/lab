import { z } from 'zod/mini';

/**
 * Generates a Uint8Array of 16 cryptographically secure random values.
 *
 * The number 16 is used to generate a 128-bit value. Each element in a Uint8Array is an 8-bit
 * value, so an array of 16 elements gives you 128 bits.
 *
 * 128 bits provides sufficient entropy for most cryptographic applications, including CSP nonces.
 * The probability of collision is approximately 2^-64 after generating 2^64 nonces (birthday
 * paradox).
 *
 * A nonce (number used once) helps prevent various attacks by ensuring uniqueness in cryptographic
 * operations. In CSP contexts, it prevents inline script injection by requiring attackers to guess
 * the unpredictable nonce value.
 *
 * Note: While 128-bit nonces provide strong security, the actual security depends on proper
 * implementation (e.g., ensuring true randomness, preventing nonce reuse) and the specific
 * cryptographic protocol being used.
 *
 * Larger nonces (e.g., 256-bit) provide marginally better security but require more bandwidth.
 * Smaller nonces (e.g., 64-bit) may be acceptable for some use cases but have higher collision
 * probability over time.
 *
 * 128-bit nonces are widely adopted as they provide excellent security with reasonable efficiency
 * for most web security applications.
 *
 * @returns - A Uint8Array of 16 cryptographically secure random values.
 */
function getRandomValues(): Uint8Array {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);

  return array;
}

/**
 * Converts a Uint8Array to a hexadecimal string.
 *
 * The padStart method is used to ensure each byte is represented as a two-digit hexadecimal number.
 * This is necessary because a byte can have a value from 0 to 255, which is represented as a
 * hexadecimal number from 00 to ff.
 *
 * @param byteArray - The Uint8Array to convert.
 * @returns A hexadecimal string representation of the byteArray.
 */
function toHexString(byteArray: Uint8Array): string {
  return Array.from(byteArray, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export const NonceSchema = z.string().brand('Nonce');

/** @see {@link NonceSchema} */
export type Nonce = z.infer<typeof NonceSchema>;

/**
 * Generates a cryptographically secure nonce as a hexadecimal string.
 *
 * A nonce (number used once) is a unique value used in security protocols to prevent replay attacks
 * and ensure request freshness. This implementation generates a 128-bit nonce suitable for CSP
 * (Content Security Policy) and other web security mechanisms.
 *
 * The nonce is returned as a hexadecimal string for easy integration with web standards like CSP
 * headers and HTML attributes.
 *
 * Important: Each nonce should be used only once per security context. Reusing nonces can
 * compromise security depending on the application.
 *
 * @returns - A cryptographically secure nonce as a hexadecimal string.
 */
export function generateNonce() {
  const randomValues = getRandomValues();

  return toHexString(randomValues) as Nonce;
}
