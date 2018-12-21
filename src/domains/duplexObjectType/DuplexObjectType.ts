import { objectTypeRegistry } from '../objectType/registry'
import { compileObjectTypeWithConfig } from '../objectType/compiler/objectType'

import { inputObjectTypeRegistry } from '../inputObjectType/registry'
import { compileInputObjectTypeWithConfig } from '../inputObjectType/objectTypeCompiler'
export { ObjectTypeError } from './error'

export interface IObjectTypeOptions {
  name?: string
  description?: string
}

export function DuplexObjectType(options?: IObjectTypeOptions): ClassDecorator {
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
