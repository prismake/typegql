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

/**
 *
 * @param input
 * @param allowThunk
 * @param preferInputType We want to be able to have single class used both for output and input type - thats why we need to be able to set resolve priority in different scenarios
 */
export function resolveType(
  input: any,
  preferInputType = false,
  allowThunk = true,
): GraphQLType {
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

  if (preferInputType && inputObjectTypeRegistry.has(input)) {
    return compileInputObjectType(input);
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

  try {
    return resolveType(input(), preferInputType, false);
  } catch (error) {
    return;
  }
}

function resolveListType(input: any[], preferInputType = false): GraphQLType {
  if (input.length !== 1) {
    return;
  }
  const [itemType] = input;

  const resolvedItemType = resolveType(itemType, preferInputType);

  if (!resolvedItemType) {
    return;
  }
  return new GraphQLList(new GraphQLNonNull(resolvedItemType));
}

export function resolveTypesList(
  types: Thunk<any[]>,
  preferInputType = false,
): GraphQLType[] {
  if (Array.isArray(types)) {
    return types.map(type => {
      return resolveType(type, preferInputType);
    });
  }
  return types().map(type => {
    return resolveType(type, preferInputType);
  });
}
