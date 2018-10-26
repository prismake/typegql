import { GraphQLObjectType } from 'graphql'
import { ObjectTypeError, objectTypeRegistry } from '../index'

import { compileAllFields } from '../../field'
import {
  getClassWithAllParentClasses,
  createCachedThunk,
} from '../../../services/utils'

const compileOutputTypeCache = new WeakMap<Function, GraphQLObjectType>()

export interface TypeOptions {
  name: string
  description?: string
  mixins?: Function[]
  implements?: Function | Function[]
}

export function createTypeFieldsGetter(
  target: Function,
  mixins: Function[] = [],
) {
  const targetWithParents = getClassWithAllParentClasses(target).concat(mixins)

  // const hasFields = targetWithParents.some((ancestor) => {
  //   return !fieldsRegistry.isEmpty(ancestor)
  // })

  // if (!hasFields) {
  //   throw new ObjectTypeError(target, `There are no fields inside this type.`)
  // }

  return createCachedThunk(() => {
    return compileAllFields(targetWithParents)
  })
}
console.log('aaa')
export function compileObjectTypeWithConfig(
  target: Function,
  config: TypeOptions,
): GraphQLObjectType {
  console.log('config.implements: ', config.implements)

  if (compileOutputTypeCache.has(target)) {
    return compileOutputTypeCache.get(target)
  }

  const compiled = new GraphQLObjectType({
    // interfaces: [(arguments) => {

    // }]
    name: config.name,
    description: config.description,
    isTypeOf: (value: any) => value instanceof target,
    fields: createTypeFieldsGetter(target, config.mixins),
  })

  compileOutputTypeCache.set(target, compiled)
  return compiled
}

export function compileObjectType(target: Function) {
  if (!objectTypeRegistry.has(target)) {
    throw new ObjectTypeError(
      target,
      `Class is not registered. Make sure it's decorated with @ObjectType decorator`,
    )
  }

  const compiler = objectTypeRegistry.get(target)
  return compiler()
}
