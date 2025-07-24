/** Returns `element.ownerDocument || document`. */
export function ownerDocument(node?: Window | Document | Node | null): Document {
  if (!node) return document;

  if ('self' in node) return node.document;

  return node.ownerDocument ?? document;
}

/** Returns `element.ownerDocument.defaultView || window`. */
export function ownerWindow(node?: Window | Document | Node | null): typeof globalThis {
  if (!node) return globalThis;

  if ('self' in node) return node.self;

  return ownerDocument(node).defaultView ?? globalThis;
}
// Determines if the DOM is accessible (i.e., running in a browser environment). Useful for SSR checks.
function checkIsBrowser() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-deprecated
  return globalThis.window !== undefined && !!globalThis.document?.createElement;
}

/**
 * Indicates whether the code is running in a browser environment (`true`) or on the server
 * (`false`).
 *
 * @example
 *   if (canUseDOM) {
 *     // Safe to access DOM APIs
 *     document.title = 'My App';
 *   }
 */
export const canUseDOM = checkIsBrowser();

export function dataAttribute(condition: boolean | null | undefined) {
  return condition ? '' : undefined;
}
