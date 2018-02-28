import * as objectPath from 'object-path';

type PathPart = string | number;

type Path = PathPart | PathPart[];

function flattenPaths(paths: Path[]): string[] {
  return paths.reduce((accumulatedPath: string[], nextPath) => {
    if (Array.isArray(nextPath)) {
      return [...accumulatedPath, ...nextPath.map(pathPart => `${pathPart}`)];
    }
    return [...accumulatedPath, `${nextPath}`];
  }, []) as string[];
}

export class DeepWeakMap<Key extends Object, Value, Structure = any> {
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

  set(target: Key, path: Path, value: Value) {
    objectPath.set(this.getAll(target), path, value);
  }

  get(target: Key, ...paths: Path[]): Value {
    const path = flattenPaths(paths);
    return objectPath.get(this.getAll(target), path);
  }

  has(target: Key, ...paths: Path[]): boolean {
    const path = flattenPaths(paths);
    return !!this.get(target, ...paths);
  }
}
