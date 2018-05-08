const shownRegistry = new WeakMap<any, true>();

export function showDeprecationWarning(
  message: string,
  uniqueIdentifier?: any,
  callback?: (message: string) => void,
) {
  if (uniqueIdentifier && shownRegistry.has(uniqueIdentifier)) {
    return;
  }
  if (uniqueIdentifier) {
    shownRegistry.set(uniqueIdentifier, true);
  }
  console.warn(`@Deprecation warning: ${message}`);
  if (callback) {
    callback(message);
  }
}
