import { fieldsRegistry, IFieldInnerConfig } from '../field/registry'
import {
  inputFieldsRegistry,
  IFieldInputInnerConfig
} from '../inputField/registry'
import { IArrayFieldOptions } from '../field/Field'

export { FieldError } from './error'

interface IDuplexFieldOptions extends IArrayFieldOptions {
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

export function DuplexArrayField(
  options?: IArrayFieldOptions
): PropertyDecorator {
  const typeOrCastTo = options?.itemCast ?? null

  if (!typeOrCastTo) {
    throw new TypeError(
      'ArrayField must have an explicit itemType or itemCast config'
    )
  }
  return DuplexField(options)
}
