import {
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLScalarType,
} from 'graphql';
import 'reflect-metadata';
export type ParsableScalar = String | Number | Boolean;

export function isParsableScalar(input: any): input is ParsableScalar {
  return [String, Number, Boolean].includes(input);
}

export function parseNativeTypeToGraphQL(input: any): GraphQLScalarType {
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

// type MetadataType = 'design:returntype' | 'design:type' | 'design:paramtypes';

export function inferTypeByTarget(target: Function, key?: string) {
  if (!key) {
    return Reflect.getMetadata('design:type', target);
  }

  const returnType = Reflect.getMetadata('design:returntype', target, key);
  if (returnType) {
    return returnType;
  }

  const targetField = (target as any)[key];

  if (targetField && typeof targetField === 'function') {
    return Reflect.getMetadata('design:returntype', target, key);
  }
  return Reflect.getMetadata('design:type', target, key);
}
