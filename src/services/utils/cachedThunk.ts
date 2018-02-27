const cacheSymbol = Symbol('thunk.cache');

declare global {
  interface Function {
    [cacheSymbol]?: any;
  }
}

export function createCachedThunk<ThunkResult>(
  thunk: () => ThunkResult,
): () => ThunkResult {
  return () => {
    if (thunk[cacheSymbol]) {
      return thunk[cacheSymbol];
    }
    return (thunk[cacheSymbol] = thunk());
  };
}
