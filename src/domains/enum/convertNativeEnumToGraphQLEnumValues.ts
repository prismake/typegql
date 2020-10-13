import { GraphQLEnumValueConfigMap } from 'graphql'
import { EnumFieldsConfig } from './registerEnum'

function validateForGraphqlJs(val: string) {
  if (!val.match(/^[_a-zA-Z][_a-zA-Z0-9]*$/)) {
    // https://github.com/graphql/graphql-js/issues/936#issuecomment-349887156
    throw new Error(`enum key "${val}" cannot be exposed on graphql`)
  }
}

export function convertNativeEnumToGraphQLEnumValues(
  enumDef: any,
  fieldsConfig?: EnumFieldsConfig<any>,
  useKeys = false
): GraphQLEnumValueConfigMap {
  const valueConfigMap: GraphQLEnumValueConfigMap = {}
  Object.entries(enumDef).forEach(([key, val]) => {
    if (!isNaN(key as any)) {
      return
    }
    const fieldConfig = fieldsConfig && fieldsConfig[key]
    if (typeof val === 'string' && useKeys === false) {
      validateForGraphqlJs(val)
      valueConfigMap[val] = {
        value: val,
        deprecationReason: fieldConfig?.deprecationReason,
        description: fieldConfig?.description
      }
    } else {
      validateForGraphqlJs(key)
      valueConfigMap[key] = {
        value: val,
        deprecationReason: fieldConfig?.deprecationReason,
        description: fieldConfig?.description
      }
    }
  })
  return valueConfigMap
}
