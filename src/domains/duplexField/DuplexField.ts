import { fieldsRegistry, FieldInnerConfig } from '../field/registry'
import {
  inputFieldsRegistry,
  FieldInputInnerConfig
} from '../inputField/registry'

export { FieldError } from './error'

export function DuplexField(options?: {
  name?: string
  description?: string
  isNullable?: boolean
  inputNullable?: boolean
  type?: any
}): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    let isNullable = true
    let inputNullable = true
    if (options) {
      if (options.isNullable !== undefined) {
        isNullable = options.isNullable
      }
      if (options.inputNullable !== undefined) {
        inputNullable = options.inputNullable
      }
      delete options.isNullable
      delete options.inputNullable
    }

    const finalInputConfig: FieldInputInnerConfig = {
      property: fieldName,
      name: fieldName,
      isNullable: inputNullable,
      ...options
    } as any

    const finalConfig: FieldInnerConfig = {
      property: fieldName,
      name: fieldName,
      isNullable,
      ...options
    } as any
    fieldsRegistry.set(targetInstance.constructor, fieldName, finalConfig)

    inputFieldsRegistry.set(
      targetInstance.constructor,
      fieldName,
      finalInputConfig
    )
  }
}
