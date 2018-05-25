import { isType, GraphQLType, GraphQLList, GraphQLNonNull } from 'graphql';
import { Thunk } from '~/services/types';
import {
  objectTypeRegistry,
  compileObjectType,
  inputObjectTypeRegistry,
  compileInputObjectType,
  enumsRegistry,
  unionRegistry,
} from '~/domains';
import { parseNativeTypeToGraphQL, isParsableScalar } from './parseNative';

export function resolveType(input: any, allowThunk = true): GraphQLType {
  if (isType(input)) {
    return input;
  }

  if (isParsableScalar(input)) {
    return parseNativeTypeToGraphQL(input);
  }

  if (Array.isArray(input)) {
    return resolveListType(input);
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

  if (inputObjectTypeRegistry.has(input)) {
    return compileInputObjectType(input);
  }

  if (input === Promise) {
    return;
  }

  if (!allowThunk || typeof input !== 'function') {
    return;
  }

  return resolveType(input(), false);
}

function resolveListType(input: any[]): GraphQLType {
  if (input.length !== 1) {
    return;
  }
  const [itemType] = input;

  const resolvedItemType = resolveType(itemType);

  if (!resolvedItemType) {
    return;
  }
  return new GraphQLList(new GraphQLNonNull(resolvedItemType));
}

export function resolveTypesList(types: Thunk<any[]>): GraphQLType[] {
  if (Array.isArray(types)) {
    return types.map(type => {
      return resolveType(type);
    });
  }
  return types().map(type => {
    return resolveType(type);
  });
}
