import * as objectPath from 'object-path';

export type DeepWeakMapPath = (string | number) | (string | number)[];

function flattenPaths(paths: DeepWeakMapPath[]): string[] {
  return paths.reduce((accumulatedPath: string[], nextPath) => {
    if (Array.isArray(nextPath)) {
      return [...accumulatedPath, ...nextPath.map(pathPart => `${pathPart}`)];
    }
    return [...accumulatedPath, `${nextPath}`];
  }, []) as string[];
}

export class DeepWeakMap<
  Key extends Object,
  Value,
  Structure = { [key: string]: Value }
> {
  private map: WeakMap<Key, Structure>;
  constructor() {
    this.map = new WeakMap();
  }

  isEmpty(target: Key) {
    return !Object.keys(this.getAll(target)).length;
  }

  getAll(target: Key): Structure {
    const { map } = this;
    if (!map.has(target)) {
      map.set(target, {} as Structure);
    }
    return map.get(target);
  }

  set(target: Key, path: DeepWeakMapPath, value: Value) {
    objectPath.set(this.getAll(target), path, value);
  }

  get(target: Key, ...paths: DeepWeakMapPath[]): Value {
    const path = flattenPaths(paths);
    return objectPath.get(this.getAll(target), path);
  }

  has(target: Key, ...paths: DeepWeakMapPath[]): boolean {
    const path = flattenPaths(paths);
    return !!this.get(target, path);
  }
}
