import { IFieldOptions } from '../field/Field'
import { fieldsRegistry, IFieldInnerConfig } from '../field/registry'
import {
  inputFieldsRegistry,
  IFieldInputInnerConfig
} from '../inputField/registry'

export { FieldError } from './error'

interface IDuplexFieldOptions extends IFieldOptions {
  inputNullable?: boolean
  itemCast?: any
}

export function DuplexField(options?: IDuplexFieldOptions): PropertyDecorator {
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

    let type
    if (options?.itemCast) {
      type = [options.itemCast]
    }

    const finalInputConfig: IFieldInputInnerConfig = {
      property: fieldName,
      name: fieldName,
      isNullable: inputNullable,
      type,
      ...options
    } as any

    const finalConfig: IFieldInnerConfig = {
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
