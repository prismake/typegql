import { inputFieldsRegistry, FieldInputInnerConfig } from './registry'

export { FieldInputInnerConfig, inputFieldsRegistry } from './registry'
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
    const finalConfig: FieldInputInnerConfig = {
      property: fieldName,
      name: fieldName,
      ...options
    }

    inputFieldsRegistry.set(targetInstance.constructor, fieldName, finalConfig)
  }
}
