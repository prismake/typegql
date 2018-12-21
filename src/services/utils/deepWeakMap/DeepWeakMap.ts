import { get, set } from 'object-path'

export type DeepWeakMapPath = (string | number) | Array<string | number>

function flattenPaths(paths: DeepWeakMapPath[]): string[] {
  return paths.reduce((accumulatedPath: string[], nextPath) => {
    if (Array.isArray(nextPath)) {
      return [...accumulatedPath, ...nextPath.map((pathPart) => `${pathPart}`)]
    }
    return [...accumulatedPath, `${nextPath}`]
  }, []) as string[]
}

export class DeepWeakMap<
  Key extends object,
  Value,
  Structure = { [key: string]: Value }
> {
  private map: WeakMap<Key, Structure>
  constructor() {
    this.map = new WeakMap()
  }

  isEmpty(target: Key) {
    return !Object.keys(this.getAll(target)).length
  }

  getAll(target: Key): Structure {
    const { map } = this
    if (!map.has(target)) {
      const empty = {}
      map.set(target, empty as Structure)
    }
    return map.get(target)
  }

  set(target: Key, path: DeepWeakMapPath, value: Value) {
    set(this.getAll(target), path, value)
  }

  get(target: Key, ...paths: DeepWeakMapPath[]): Value {
    const path = flattenPaths(paths)
    return get(this.getAll(target), path)
  }

  has(target: Key, ...paths: DeepWeakMapPath[]): boolean {
    const path = flattenPaths(paths)
    return !!this.get(target, path)
  }
}
