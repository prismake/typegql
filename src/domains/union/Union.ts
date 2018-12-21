import { unionRegistry } from './registry'
import { compileUnionType, IUnionOptions } from './compileUnionType'

export function Union(config: IUnionOptions): ClassDecorator {
  return (target) => {
    unionRegistry.set(target, () => {
      return compileUnionType(target, { name: target.name, ...config })
    })
  }
}
