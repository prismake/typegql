const shownRegistry = new WeakMap<any, true>();

export type Logger = (msg: string) => void;

export function showDeprecationWarning(
  message: string,
  uniqueIdentifier?: any,
  logger: Logger = console.log,
) {
  if (uniqueIdentifier && shownRegistry.has(uniqueIdentifier)) {
    return;
  }
  if (uniqueIdentifier) {
    shownRegistry.set(uniqueIdentifier, true);
  }
  logger(`@Deprecation warning: ${message}`);
}
