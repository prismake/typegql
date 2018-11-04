import { unionRegistry } from './registry'
import { compileUnionType, UnionOptions } from './compiler'

export function Union(config: UnionOptions): ClassDecorator {
  return (target) => {
    unionRegistry.set(target, () => {
      return compileUnionType(target, { name: target.name, ...config })
    })
  }
}
