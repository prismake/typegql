import { GraphQLString, GraphQLFloat, GraphQLBoolean } from 'graphql';

import { compileType, typeConfigRegistry } from 'domains/type';

export type BasicScalar = String | Number | Boolean;

export function isBasicScalar(input: any): input is BasicScalar {
  return [String, Number, Boolean].includes(input);
}

function parseNativeTypeToGraphQL(input: any) {
  if (input === String) {
    return GraphQLString;
  }
  if (input === Number) {
    return GraphQLFloat;
  }
  if (input === Boolean) {
    return GraphQLBoolean;
  }
}

export function parseTypeToGraphql(input: any) {
  const nativeTypeParsed = parseNativeTypeToGraphQL(input);

  if (nativeTypeParsed) {
    return nativeTypeParsed;
  }

  if (input && typeConfigRegistry.has(input)) {
    return compileType(input);
  }
}

type MetadataType = 'design:returntype' | 'design:type' | 'design:paramtypes';

export function parseTypeToGraphqlByTarget(target: Function, key?: string) {
  if (!key) {
    const rawType = Reflect.getMetadata('design:type', target);
    return parseTypeToGraphql(rawType);
  }

  const returnType = Reflect.getMetadata('design:returntype', target, key);
  if (returnType) {
    return parseTypeToGraphql(returnType);
  }

  if ((target as any)[key] && typeof (target as any)[key] === 'function') {
    const rawType = Reflect.getMetadata('design:returntype', target, key);
    return parseTypeToGraphql(rawType);
  }
  const rawType = Reflect.getMetadata('design:type', target, key);
  return parseTypeToGraphql(rawType);
}
