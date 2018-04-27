const shownRegistry = new WeakMap<any, true>();

export function showDeprecationWarning(message: string, uniqueIdentifier?: any) {
  if (uniqueIdentifier && shownRegistry.has(uniqueIdentifier)) {
    return;
  }
  if (uniqueIdentifier) {
    shownRegistry.set(uniqueIdentifier, true);
  }
  console.warn(`@Deprecation warning: ${message}`);
}
