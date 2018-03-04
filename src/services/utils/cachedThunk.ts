const cache = new WeakMap<() => any, any>();

export function createCachedThunk<ThunkResult>(
  thunk: () => ThunkResult,
): () => ThunkResult {
  return () => {
    if (cache.has(thunk)) {
      return cache.get(thunk);
    }
    const result = thunk();
    cache.set(thunk, result);
    return result;
  };
}
