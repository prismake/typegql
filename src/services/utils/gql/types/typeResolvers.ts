import { isType, GraphQLType, GraphQLList, GraphQLNonNull } from 'graphql'

import { mapNativeTypeToGraphQL, isParsableScalar } from './inferTypeByTarget'
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
    return mapNativeTypeToGraphQL(input)
  }

  if (Array.isArray(input)) {
    return resolveListType(input, isArgument)
  }
  const enumGetter = enumsRegistry.get(input)

  if (enumGetter) {
    return enumGetter
  }
  const unionGetter = unionRegistry.get(input)

  if (unionGetter) {
    return unionGetter()
  }

  const interfaceGetter = interfaceTypeRegistry.get(input)

  if (interfaceGetter) {
    return interfaceGetter()
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
    throw new Error(
      `Class ${input.name} cannot be used as a resolve type because it is not an @ObjectType`
    )
  }

  if (isNativeClass(input)) {
    throw new Error(
      `Class ${input.name} cannot be used as a resolve type because it is not an @ObjectType`
    )
  }
  return resolveType(input(), false, isArgument)
}

function resolveListType(input: any[], isArgument: boolean): GraphQLType {
  console.log('~ input232', input)
  if (input.length !== 1) {
    throw new Error('List type must have exactly one element')
  }
  const [itemType] = input

  const resolvedItemType = resolveType(itemType, true, isArgument)

  if (!resolvedItemType) {
    throw new Error('List type must have a valid item type')
  }


  return new GraphQLNonNull(
    new GraphQLList(new GraphQLNonNull(resolvedItemType)) // TODO in some cases we might want nullable? Verify
  )
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
