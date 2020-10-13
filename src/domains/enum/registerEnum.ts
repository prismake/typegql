import { GraphQLEnumType } from 'graphql'
import { EnumError } from './error'

import { enumsRegistry } from './registry'
export { enumsRegistry } from './registry'
import { convertNativeEnumToGraphQLEnumValues } from './convertNativeEnumToGraphQLEnumValues'

export interface DescriptionOptions {
  description?: string
}
export interface DeprecationOptions {
  deprecationReason?: string
}

export type EnumFieldsConfig<TEnum extends object> = Partial<
  Record<keyof TEnum, DescriptionOptions & DeprecationOptions>
>

/**
 * useKeys as true might be needed if you need to expose your string enum using it's keys instead of it's values
 */
export interface IEnumOptions {
  name: string
  description?: string
  useKeys?: boolean
  fieldsConfig?: EnumFieldsConfig<any>
}

export function registerEnum(enumDef: Object, options: IEnumOptions | string) {
  if (typeof options === 'string') {
    options = { name: options }
  }
  const { name, description, fieldsConfig }: IEnumOptions = options

  if (enumsRegistry.has(enumDef)) {
    throw new EnumError(name, `Enum is already registered`)
  }

  const values = convertNativeEnumToGraphQLEnumValues(
    enumDef,
    fieldsConfig,
    options.useKeys
  )
  const enumType = new GraphQLEnumType({
    name,
    description,
    values
  })
  enumsRegistry.set(enumDef, enumType)
  return enumType
}
