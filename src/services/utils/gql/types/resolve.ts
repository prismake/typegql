import { isType, GraphQLType } from 'graphql';
import { Thunk, AnyClass } from 'services/types';
import { objectTypeRegistry, compileObjectType } from 'domains';
import { enumsRegistry, unionRegistry } from 'domains';
import { parseNativeTypeToGraphQL, isParsableScalar } from './parseNative';

export function resolveType(input: any, allowThunk = true): GraphQLType {
  if (isType(input)) {
    return input;
  }

  if (isParsableScalar(input)) {
    return parseNativeTypeToGraphQL(input);
  }

  if (enumsRegistry.has(input)) {
    return enumsRegistry.get(input);
  }

  if (unionRegistry.has(input)) {
    return unionRegistry.get(input)();
  }

  if (objectTypeRegistry.has(input)) {
    return compileObjectType(input);
  }

  if (!allowThunk || typeof input !== 'function') {
    return;
  }

  return resolveType(input(), false);
}

export function resolveTypes(types: Thunk<any[]>): GraphQLType[] {
  if (Array.isArray(types)) {
    return types.map(type => {
      return resolveType(type);
    });
  }
  return types().map(type => {
    return resolveType(type);
  });
}
