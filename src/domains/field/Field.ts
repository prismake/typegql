import { fieldsRegistry, IFieldInnerConfig } from './registry'
import { rootFieldTypes } from '../schema/rootFields'

export {
  IFieldInnerConfig as FieldInnerConfig,
  fieldsRegistry,
  queryFieldsRegistry
} from './registry'
export { compileAllFields, compileFieldConfig } from './compiler/fieldCompiler'
export { FieldError } from './error'

export interface IFieldOptionsBase {
  description?: string
  rootFieldType?: rootFieldTypes

  onlyDecoratedArgs?: boolean
  name?: string
}

export interface IFieldOptions extends IFieldOptionsBase {
  isNullable?: boolean
  itemNullable?: boolean
  castTo?: any
  deprecationReason?: string
}

export interface IArrayFieldOptions extends IFieldOptions {
  itemCast?: any
  itemNullable?: boolean
}

export function Field(
  options?: IFieldOptions | IArrayFieldOptions
): PropertyDecorator {
  return (targetInstance: Object, fieldName: string) => {
    if (
      options &&
      options.hasOwnProperty('castTo') &&
      (options as IFieldOptions).castTo === undefined
    ) {
      console.log(
        'This usually happens when a circular dependency is present. Wrap your explicit castTo in an arrow function to avoid this problem.'
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
          `Field "${fieldName}" on class ${targetInstance.constructor.name} cannot be registered-it's already registered`
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
 * alias to help define array returning resolvers less verbosely and to enforce convention of arrays being not nullable
 * in real world scenarios you always want the array to be non nullable
 */
export function ArrayField(options?: IArrayFieldOptions): PropertyDecorator {
  const typeOrCastTo = options?.itemCast ?? null

  if (!typeOrCastTo) {
    throw new TypeError(
      'ArrayField must have an explicit itemType or itemCast config'
    )
  }
  return Field(options)
}
