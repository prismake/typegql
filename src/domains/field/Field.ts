import { fieldsRegistry, IFieldInnerConfig } from './registry'
import { rootFieldTypes } from '../schema/rootFields'

export {
  IFieldInnerConfig as FieldInnerConfig,
  fieldsRegistry,
  queryFieldsRegistry
} from './registry'
export { compileAllFields, compileFieldConfig } from './compiler/fieldCompiler'
export { FieldError } from './error'

export interface IFieldOptions extends IFieldOptionsBase {
  isNullable?: boolean
}

export interface IFieldOptionsBase {
  description?: string
  rootFieldType?: rootFieldTypes
  type?: any
  castTo?: any
  onlyDecoratedArgs?: boolean
  name?: string
}

export function Field(options?: IFieldOptions): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    if (
      options &&
      options.hasOwnProperty('type') &&
      options.type === undefined
    ) {
      console.log(
        'This usually happens when a circular dependency is present. Wrap your explicit type in an arrow function to avoid this problem.'
      )
      throw new TypeError(
        `Field "${fieldName}" on ${targetInstance.constructor} got an "undefined" as explicit type`
      )
    }
    const finalConfig: IFieldInnerConfig = {
      property: fieldName,
      name: fieldName,
      isNullable: true,
      ...options
    }
    const existingField = fieldsRegistry.get(
      targetInstance.constructor,
      fieldName
    )

    if (existingField) {
      if (!options.rootFieldType) {
        throw new TypeError(
          `Field "${fieldName}" on class ${targetInstance.constructor.name} cannot be registered-it's already registered as type ${existingField.type.name}`
        )
      }
      if (options.rootFieldType === existingField.rootFieldType) {
        throw new TypeError(
          `Root field "${fieldName}" on schema class ${targetInstance.constructor.name} cannot be registered as a ${existingField.rootFieldType}-it's already registered`
        )
      }
    }

    fieldsRegistry.set(targetInstance.constructor, fieldName, finalConfig)
  }
}

/**
 * alias to help define array returning resolvers less verbosely
 */
export function ArrayField(options?: IFieldOptionsBase): PropertyDecorator {
  const typeOrCastTo = options ? options.type || options.castTo : null

  const optionsPassed = {
    ...options,
    isNullable: false
  }
  if (typeOrCastTo) {
    optionsPassed.type = Array.isArray(typeOrCastTo)
      ? typeOrCastTo
      : [typeOrCastTo]
  }
  return Field(optionsPassed)
}
