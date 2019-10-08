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

export interface IInputFieldOptions {
  description?: string
  defaultValue?: any
  type?: any
  name?: string
  isNullable?: boolean
}

export function InputField(options?: IInputFieldOptions): PropertyDecorator {
  return (targetInstance: typeof Object, fieldName: string) => {
    if (
      options &&
      options.hasOwnProperty('type') &&
      options.type === undefined
    ) {
      console.log(
        'This can happens when a circular dependency is present. Wrap your explicit type in an arrow function to avoid this problem.'
      )
      throw new TypeError(
        `InputField "${fieldName}" explicit type is "undefined" on InputObjectType ${targetInstance.constructor}`
      )
    }

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
  options?: IInputFieldOptions
): PropertyDecorator {
  return InputField({ ...options, isNullable: true })
}
