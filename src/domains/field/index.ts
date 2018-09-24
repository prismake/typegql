import { fieldsRegistry, FieldInnerConfig } from './registry'

export {
  FieldInnerConfig,
  fieldsRegistry,
  queryFieldsRegistry,
} from './registry'
export { compileAllFields, compileFieldConfig } from './compiler/index'
export { FieldError } from './error'

export interface FieldOptions {
  description?: string
  type?: any
  name?: string
  isNullable?: boolean
}

export function Field(options?: FieldOptions): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    const finalConfig: FieldInnerConfig = {
      property: fieldName,
      name: fieldName,
      isNullable: true,
      ...options,
    }
    const existingField = fieldsRegistry.get(
      targetInstance.constructor,
      fieldName,
    )
    if (existingField) {
      throw new TypeError(
        `Field "${fieldName}" on class ${
          targetInstance.constructor.name
        } cannot be registered-it's already registered as type ${
          existingField.type.name
        }`,
      )
    }

    fieldsRegistry.set(targetInstance.constructor, fieldName, {
      ...finalConfig,
    })
  }
}
