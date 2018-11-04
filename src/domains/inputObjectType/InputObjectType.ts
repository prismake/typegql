import { compileInputObjectTypeWithConfig } from './compiler/index'
import { inputObjectTypeRegistry } from './registry'

export { compileInputObjectType } from './compiler/index'
export { InputObjectTypeError } from './error'
export { inputObjectTypeRegistry } from './registry'

export interface InputObjectTypeOptions {
  name?: string
  description?: string
}

export function InputObjectType(
  options?: InputObjectTypeOptions
): ClassDecorator {
  return (target: Function) => {
    const config = { name: target.name, ...options }
    const inputTypeCompiler = () =>
      compileInputObjectTypeWithConfig(target, config)
    inputObjectTypeRegistry.set(target, inputTypeCompiler)
  }
}
