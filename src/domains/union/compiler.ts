import { GraphQLUnionType, GraphQLObjectType } from 'graphql';

import { resolveTypes, isObjectType } from 'services/utils';
import { UnionError } from './error';

const compileUnionCache = new WeakMap<Function, GraphQLUnionType>();

function getDefaultResolver(types: GraphQLObjectType[]) {
  return (value: any, context: any, info: any) => {
    for (let type of types) {
      if (type.isTypeOf(value, context, info)) {
        return type;
      }
    }
  };
}

export function compileUnionType(target: Function, config: any) {
  if (compileUnionCache.has(target)) {
    return compileUnionCache.get(target);
  }

  const { types, resolver, name } = config;

  const resolvedTypes = resolveTypes(types);

  for (let type of resolvedTypes) {
    if (!isObjectType(type)) {
      throw new UnionError(
        target,
        `Every union type must be of type GraphQLObjectType. '${type}' is not.`,
      );
    }
  }

  const typeResolver =
    resolver || getDefaultResolver(resolvedTypes as GraphQLObjectType[]);

  const compiled = new GraphQLUnionType({
    name,
    resolveType: typeResolver,
    types: resolvedTypes as GraphQLObjectType[],
  });

  compileUnionCache.set(target, compiled);
  return compiled;
}
