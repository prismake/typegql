import { fieldsRegistry, FieldInnerConfig } from './registry'
import { rootFieldTypes } from '../schema/rootFields'

export {
  FieldInnerConfig,
  fieldsRegistry,
  queryFieldsRegistry,
} from './registry'
export { compileAllFields, compileFieldConfig } from './compiler/index'
export { FieldError } from './error'

export interface FieldOptions {
  description?: string
  rootFieldType?: rootFieldTypes
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
      if (!options.rootFieldType) {
        throw new TypeError(
          `Field "${fieldName}" on class ${
            targetInstance.constructor.name
          } cannot be registered-it's already registered as type ${
            existingField.type.name
          }`,
        )
      }
      if (options.rootFieldType === existingField.rootFieldType) {
        throw new TypeError(
          `Root field "${fieldName}" on schema class ${
            targetInstance.constructor.name
          } cannot be registered as a ${
            existingField.rootFieldType
          }-it's already registered`,
        )
      }
    }

    fieldsRegistry.set(targetInstance.constructor, fieldName, finalConfig)
  }
}
