import { inputFieldsRegistry, IFieldInputInnerConfig } from './registry'

export {
  IFieldInputInnerConfig as FieldInputInnerConfig,
  inputFieldsRegistry
} from './registry'
export {
  compileAllInputFields,
  compileInputFieldConfig
} from './compiler/index'
export { InputFieldError } from './error'

export interface InputFieldOptions {
  description?: string
  defaultValue?: any
  type?: any
  name?: string
  isNullable?: boolean
}

export function InputField(options?: InputFieldOptions): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    const finalConfig: IFieldInputInnerConfig = {
      property: fieldName,
      name: fieldName,
      ...options
    }

    inputFieldsRegistry.set(targetInstance.constructor, fieldName, finalConfig)
  }
}

/**
 * a shorthand for @InputField({isNullable: true})
 */
export function InputFieldNullable(
  options?: InputFieldOptions
): PropertyDecorator {
  return InputField({ ...options, isNullable: true })
}
