import cspBuilder from 'content-security-policy-builder';

import { mergeWith } from '../merge-with';
import { uniq } from '../uniq';

/** Represents the values that can be used in a Content Security Policy directive. */
type DirectiveValues = string[] | string | boolean;

/**
 * Represents the options that can be passed to the PolicyBuilder function.
 *
 * @see {@link https://content-security-policy.com}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy}
 */
export interface PolicyBuilderOptions {
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src} */
  defaultSrc: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src} */
  scriptSrc: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src} */
  styleSrc: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src} */
  imgSrc: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/connect-src} */
  connectSrc: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/font-src} */
  fontSrc: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/object-src} */
  objectSrc: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/media-src} */
  mediaSrc: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-src} */
  frameSrc: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/sandbox} */
  sandbox: DirectiveValues;
  /**
   * @deprecated
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri}
   */
  reportUri: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/child-src} */
  childSrc: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/form-action} */
  formAction: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors} */
  frameAncestors: DirectiveValues;
  /**
   * @deprecated
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/plugin-types}
   */
  pluginTypes: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/base-uri} */
  baseUri: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to} */
  reportTo: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/worker-src} */
  workerSrc: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/manifest-src} */
  manifestSrc: DirectiveValues;
  /**
   * @deprecated
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/prefetch-src}
   */
  prefetchSrc: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/navigate-to} */
  navigateTo: DirectiveValues;
  /** @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests} */
  upgradeInsecureRequests: boolean;
  /**
   * @deprecated
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/block-all-mixed-content}
   */
  blockAllMixedContent: boolean;
}

/**
 * Merges default and user-provided CSP directives.
 *
 * The function merges `defaultDirectives` and `userDirectives` into a new object. If both
 * `defaultDirectives` and `userDirectives` include a directive, the function concatenates the
 * values of the directive, removes duplicates, and includes the result in the new object. If a
 * directive is included in `defaultDirectives` but not in `userDirectives`, or vice versa, the
 * function includes the directive and its value in the new object as is.
 *
 * @param defaultDirectives - An object representing default CSP directives.
 * @param userDirectives - An object representing user-provided CSP directives.
 * @returns - An object representing the merged CSP directives.
 */
export function mergeDirectiveValues(
  defaultDirectives: Record<string, DirectiveValues>,
  userDirectives: Record<string, DirectiveValues>,
): Record<string, DirectiveValues> {
  return mergeWith({}, defaultDirectives, userDirectives, (objectValue, sourceValue) => {
    const normalizedObjectValue = Array.isArray(objectValue)
      ? objectValue
      : objectValue === undefined
        ? []
        : [objectValue];

    const normalizedSourceValue = Array.isArray(sourceValue)
      ? sourceValue
      : sourceValue === undefined
        ? []
        : [sourceValue];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return uniq(normalizedObjectValue.concat(normalizedSourceValue));
  });
}

/**
 * Creates a Content Security Policy (CSP) header value.
 *
 * @param nonce - A nonce to include in the CSP header.
 * @param options - An optional object representing user-provided CSP directives.
 * @returns - A CSP header value as a string.
 */
export function createCSPHeader(nonce: string, options?: Partial<PolicyBuilderOptions>) {
  const directives = options ?? {};
  const nonceString = `'nonce-${nonce}'`;

  const defaultDirectives = {
    baseUri: ["'self'"],
    defaultSrc: ["'self'", nonceString],
    frameAncestors: ["'none'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    connectSrc: ["'self'"],
    scriptSrc: ["'strict-dynamic'", "'self'", nonceString],
  } satisfies Partial<PolicyBuilderOptions>;

  /** Add support for development environments by allowing connections to localhost. */
  if (import.meta.env.NODE_ENV === 'development') {
    defaultDirectives.styleSrc.push('http://localhost:*');
    defaultDirectives.defaultSrc.push('http://localhost:*');
    defaultDirectives.connectSrc.push(
      'http://localhost:*',
      // For HMR:
      'ws://localhost:*',
      'ws://127.0.0.1:*',
    );
  }

  /** Merge the default directives with the user-provided directives. */
  const combinedDirectives = mergeDirectiveValues(defaultDirectives, directives);

  return cspBuilder({ directives: combinedDirectives });
}
