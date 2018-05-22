import {
  GraphQLUnionType,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLType,
} from 'graphql';

import { resolveTypesList, isObjectType, resolveType } from '~/services/utils';
import { Thunk } from '~/services/types';
import { UnionError } from './error';

export interface UnionTypeResolver {
  (value: any, context: any, info: GraphQLResolveInfo): any;
}

export interface UnionOptions {
  types: Thunk<any[]>;
  name: string;
  resolveTypes?: UnionTypeResolver;
}

const compileUnionCache = new WeakMap<Function, GraphQLUnionType>();

function getDefaultResolver(types: GraphQLObjectType[]): UnionTypeResolver {
  return (value: any, context: any, info: any) => {
    for (let type of types) {
      if (type.isTypeOf && type.isTypeOf(value, context, info)) {
        return type;
      }
    }
  };
}

/**
 * Resolves type, and if needed, tries to resolve it using typegql-aware types
 */
function enhanceTypeResolver(originalResolver: UnionTypeResolver): UnionTypeResolver {
  return (value, context, info) => {
    const rawResolvedType = originalResolver(value, context, info);
    return resolveType(rawResolvedType);
  };
}

function validateResolvedTypes(
  target: Function,
  types: GraphQLType[],
): types is GraphQLObjectType[] {
  for (let type of types) {
    if (!isObjectType(type)) {
      throw new UnionError(
        target,
        `Every union type must be of type GraphQLObjectType. '${type}' is not.`,
      );
    }
  }
  return true;
}

export function compileUnionType(target: Function, config: UnionOptions) {
  if (compileUnionCache.has(target)) {
    return compileUnionCache.get(target);
  }

  const { types, resolveTypes, name } = config;

  const resolvedTypes = resolveTypesList(types);

  if (!validateResolvedTypes(target, resolvedTypes)) {
    return;
  }

  const typeResolver = resolveTypes
    ? enhanceTypeResolver(resolveTypes)
    : getDefaultResolver(resolvedTypes);

  const compiled = new GraphQLUnionType({
    name,
    resolveType: typeResolver,
    types: resolvedTypes as GraphQLObjectType[],
  });

  compileUnionCache.set(target, compiled);
  return compiled;
}
