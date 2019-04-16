import { inputObjectTypeRegistry } from './registry'
import { compileInputObjectTypeWithConfig } from './objectTypeCompiler'

export { InputObjectTypeError } from './error'
export { inputObjectTypeRegistry } from './registry'

export interface IInputObjectTypeOptions {
  name?: string
  description?: string
}

export function InputObjectType(
  options?: IInputObjectTypeOptions
): ClassDecorator {
  return (target: Function) => {
    const config = { name: target.name, ...options }
    const inputTypeCompiler = () =>
      compileInputObjectTypeWithConfig(target, config)
    inputObjectTypeRegistry.set(target, inputTypeCompiler)
  }
}
