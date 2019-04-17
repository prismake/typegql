import { isType, GraphQLType, GraphQLList, GraphQLNonNull } from 'graphql'

import { parseNativeTypeToGraphQL, isParsableScalar } from './parseNative'
import {
  enumsRegistry,
  unionRegistry,
  inputObjectTypeRegistry,
  objectTypeRegistry,
  compileInputObjectType,
  compileObjectType
} from '../../../../index'

import { Thunk } from '../../../types'
import { interfaceTypeRegistry } from '../../../../domains/interfaceType/interfaceTypeRegistry'

function isNativeClass(thing: any) {
  return (
    typeof thing === 'function' &&
    thing.hasOwnProperty('prototype') &&
    !thing.hasOwnProperty('arguments')
  )
}
/**
 * @param input is a type provided in the decorator config
 */
export function resolveType(
  input: any,
  allowThunk = true,
  isArgument: boolean = false
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

  if (interfaceTypeRegistry.has(input)) {
    return interfaceTypeRegistry.get(input)()
  }

  if (isArgument && inputObjectTypeRegistry.has(input)) {
    return compileInputObjectType(input)
  }

  if (objectTypeRegistry.has(input)) {
    return compileObjectType(input)
  }

  if (
    input === Promise ||
    input === Object || // "any" gets inferred as Object by reflect-metadata
    !allowThunk ||
    typeof input !== 'function'
  ) {
    return
  }

  if (isNativeClass(input)) {
    throw new Error(
      `Class ${
        input.name
      } cannot be used as a resolve type because it is not an @ObjectType`
    )
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
