import {
  GraphQLUnionType,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLType,
  isObjectType
} from 'graphql'

import { UnionError } from './error'
import { Thunk } from '../../services/types'
import {
  resolveType,
  resolveTypesList
} from '../../services/utils/gql/types/typeResolvers'

export type UnionTypeResolver = (
  value: any,
  context: any,
  info: GraphQLResolveInfo
) => any

export interface IUnionOptions {
  types: Thunk<any[]>
  name?: string
  resolveTypes?: UnionTypeResolver
}

const compileUnionCache = new WeakMap<Function, GraphQLUnionType>()

function getDefaultResolver(types: GraphQLObjectType[]): UnionTypeResolver {
  return (value: any, context: any, info: any) => {
    for (const type of types) {
      if (type.isTypeOf && type.isTypeOf(value, context, info)) {
        return type
      }
    }
  }
}

/**
 * Resolves type, and if needed, tries to resolve it using decapi-aware types
 */
function enhanceTypeResolver(
  originalResolver: UnionTypeResolver
): UnionTypeResolver {
  return (value, context, info) => {
    const rawResolvedType = originalResolver(value, context, info)
    return resolveType(rawResolvedType)
  }
}

function validateResolvedTypes(
  target: Function,
  types: GraphQLType[]
): types is GraphQLObjectType[] {
  for (const type of types) {
    if (!isObjectType(type)) {
      throw new UnionError(
        target,
        `Every union type must be of type GraphQLObjectType. '${type}' is not.`
      )
    }
  }
  return true
}

export function compileUnionType(target: Function, config: IUnionOptions) {
  if (compileUnionCache.has(target)) {
    return compileUnionCache.get(target)
  }

  const { types, resolveTypes, name } = config

  const resolvedTypes = resolveTypesList(types)

  if (!validateResolvedTypes(target, resolvedTypes)) {
    return
  }

  const typeResolver = resolveTypes
    ? enhanceTypeResolver(resolveTypes)
    : getDefaultResolver(resolvedTypes)

  const compiled = new GraphQLUnionType({
    name,
    resolveType: typeResolver,
    types: resolvedTypes
  })

  compileUnionCache.set(target, compiled)
  return compiled
}
