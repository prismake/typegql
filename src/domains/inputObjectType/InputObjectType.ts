import { inputObjectTypeRegistry } from './registry'
import { compileInputObjectTypeWithConfig } from './objectTypeCompiler'
import { Constructor } from 'typescript-rtti'

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
      compileInputObjectTypeWithConfig(target as Constructor<Function>, config)

    inputObjectTypeRegistry.set(
      target as Constructor<Function>,
      inputTypeCompiler
    )
  }
}
