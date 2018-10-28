import { compileObjectTypeWithConfig } from './compiler/index'
import { objectTypeRegistry } from './registry'

export { compileObjectType } from './compiler/index'
export { ObjectTypeError } from './error'
export { objectTypeRegistry, inputTypeRegistry } from './registry'

export interface ObjectTypeOptions {
  name?: string
  description?: string
  mixins?: Function[]
  implements: Function
}

export function ObjectType(options?: ObjectTypeOptions): ClassDecorator {
  return (target: Function) => {
    const config = { name: target.name, ...options }
    const outputTypeCompiler = () => compileObjectTypeWithConfig(target, config)
    objectTypeRegistry.set(target, outputTypeCompiler)
  }
}
