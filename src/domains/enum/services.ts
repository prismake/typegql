import { GraphQLEnumValueConfigMap } from 'graphql';

export function convertNativeEnumToGraphQLEnumValues(
  enumDef: any,
): GraphQLEnumValueConfigMap {
  const valueConfigMap: GraphQLEnumValueConfigMap = {};
  Object.keys(enumDef).map(key => {
    if (!isNaN(key as any)) {
      return;
    }
    const value = enumDef[key];
    valueConfigMap[key] = {
      value,
    };
  });
  return valueConfigMap;
}
