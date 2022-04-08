import { isType, GraphQLType, GraphQLList, GraphQLNonNull } from 'graphql'

import {
  mapNativeScalarToGraphQL,
  isParsableScalar,
  IInferResult,
  mapNativeTypeToGraphQL
} from './inferTypeByTarget'
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
interface IResolveTypeParams {
  runtimeType: any
  isNullable?: boolean
  allowThunk?: boolean
  isArgument?: boolean
}

/**
 * @param input is a type provided in the decorator config
 */
export function resolveType({
  runtimeType: type,
  isNullable = false,
  allowThunk = true,
  isArgument = false
}: IResolveTypeParams): GraphQLType {
  if (isType(type)) {
    return type
  }

  if (isParsableScalar(type)) {
    return isNullable
      ? mapNativeTypeToGraphQL(type)
      : new GraphQLNonNull(mapNativeTypeToGraphQL(type))
  }

  if (Array.isArray(type)) {
    return resolveListType(type, isArgument)
  }
  const enumGetter = enumsRegistry.get(type)

  if (enumGetter) {
    return enumGetter
  }
  const unionGetter = unionRegistry.get(type)

  if (unionGetter) {
    return unionGetter()
  }

  const interfaceGetter = interfaceTypeRegistry.get(type)

  if (interfaceGetter) {
    return interfaceGetter()
  }

  if (isArgument && inputObjectTypeRegistry.has(type)) {
    return compileInputObjectType(type)
  }

  if (objectTypeRegistry.has(type)) {
    return compileObjectType(type)
  }

  if (
    type === Promise ||
    type === Object || // "any" gets inferred as Object by reflect-metadata
    !allowThunk ||
    typeof type !== 'function'
  ) {
    throw new Error(
      `Class ${type.name} cannot be used as a resolve type because it is not an @ObjectType`
    )
  }

  if (isNativeClass(type)) {
    throw new Error(
      `Class ${type.name} cannot be used as a resolve type because it is not an @ObjectType`
    )
  }
  return resolveType({
    runtimeType: type(),
    allowThunk: false,
    isArgument,
    isNullable
  })
}

function resolveListType(input: any[], isArgument: boolean): GraphQLType {
  if (input.length !== 1) {
    throw new Error('List type must have exactly one element')
  }
  const [itemType] = input

  const resolvedItemType = resolveType({
    runtimeType: itemType,
    isNullable: false,
    allowThunk: true,
    isArgument
  })

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
      return resolveType({ runtimeType: type })
    })
  }
  return types().map((type) => {
    return resolveType({ runtimeType: type })
  })
}
