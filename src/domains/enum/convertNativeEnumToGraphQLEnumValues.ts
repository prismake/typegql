import { GraphQLEnumValueConfigMap } from 'graphql'

export function convertNativeEnumToGraphQLEnumValues(
  enumDef: any
): GraphQLEnumValueConfigMap {
  const valueConfigMap: GraphQLEnumValueConfigMap = {}
  Object.entries(enumDef).forEach(([key, val]) => {
    if (!isNaN(key as any)) {
      return
    }

    valueConfigMap[key] = {
      value: val
    }
  })
  return valueConfigMap
}
