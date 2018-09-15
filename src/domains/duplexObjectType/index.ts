import { objectTypeRegistry } from '../objectType/registry'
import { compileObjectTypeWithConfig } from '../objectType/compiler/index'
import { compileInputObjectTypeWithConfig } from '../inputObjectType/compiler/index'
import { inputObjectTypeRegistry } from '../inputObjectType/registry'
export { ObjectTypeError } from './error'

export interface ObjectTypeOptions {
  name?: string
  description?: string
}

export function DuplexObjectType(options?: ObjectTypeOptions): ClassDecorator {
  return (target: Function) => {
    const inputConfig = { name: target.name + 'Input', ...options }
    const outputConfig = { name: target.name, ...options }

    const inputTypeCompiler = () =>
      compileInputObjectTypeWithConfig(target, inputConfig)

    inputObjectTypeRegistry.set(target, inputTypeCompiler)

    const outputTypeCompiler = () =>
      compileObjectTypeWithConfig(target, outputConfig)
    objectTypeRegistry.set(target, outputTypeCompiler)
  }
}
