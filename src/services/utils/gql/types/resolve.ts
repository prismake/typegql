import { isType, GraphQLType, GraphQLList, GraphQLNonNull } from 'graphql'

import { parseNativeTypeToGraphQL, isParsableScalar } from './parseNative'
import {
  enumsRegistry,
  unionRegistry,
  inputObjectTypeRegistry,
  objectTypeRegistry,
} from '../../../../domains'
import { compileInputObjectType, compileObjectType } from '../../../..'
import { Thunk } from '../../../types'

export function resolveType(
  input: any,
  allowThunk = true,
  isArgument?: boolean,
): GraphQLType {
  if (isType(input)) {
    return input
  }

  if (isParsableScalar(input)) {
    return parseNativeTypeToGraphQL(input)
  }

  if (Array.isArray(input)) {
    return resolveListType(input, isArgument)
  }

  if (enumsRegistry.has(input)) {
    return enumsRegistry.get(input)
  }

  if (unionRegistry.has(input)) {
    return unionRegistry.get(input)()
  }

  if (isArgument && inputObjectTypeRegistry.has(input)) {
    return compileInputObjectType(input)
  }

  if (objectTypeRegistry.has(input)) {
    return compileObjectType(input)
  }

  if (input === Promise) {
    return
  }

  if (!allowThunk || typeof input !== 'function') {
    return
  }

  return resolveType(input(), false)
}

function resolveListType(input: any[], isArgument: boolean): GraphQLType {
  if (input.length !== 1) {
    return
  }
  const [itemType] = input

  const resolvedItemType = resolveType(itemType, true, isArgument)

  if (!resolvedItemType) {
    return
  }
  return new GraphQLList(new GraphQLNonNull(resolvedItemType))
}

export function resolveTypesList(types: Thunk<any[]>): GraphQLType[] {
  if (Array.isArray(types)) {
    return types.map((type) => {
      return resolveType(type)
    })
  }
  return types().map((type) => {
    return resolveType(type)
  })
}
