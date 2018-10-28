import { GraphQLObjectType } from 'graphql'
import { ObjectTypeError, objectTypeRegistry } from '../index'

import { compileAllFields } from '../../field'
import {
  getClassWithAllParentClasses,
  createCachedThunk,
} from '../../../services/utils'
import { interfaceTypeRegistry } from '../../interfaceType/interfaceTypeRegistry'

const compileOutputTypeCache = new WeakMap<Function, GraphQLObjectType>()

export interface TypeOptions {
  name: string
  description?: string
  mixins?: Function[]
  implements?: Function
}

export function createTypeFieldsGetter(target: Function, config?: TypeOptions) {
  let targetWithParents = getClassWithAllParentClasses(target)
  if (config) {
    if (config.mixins) {
      targetWithParents = targetWithParents.concat(config.mixins)
    }
    if (config.implements) {
      targetWithParents = targetWithParents.concat(config.implements)
    }
  }

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

export function compileObjectTypeWithConfig(
  target: Function,
  config: TypeOptions,
): GraphQLObjectType {
  console.log('config.implements: ', config.implements)

  if (compileOutputTypeCache.has(target)) {
    return compileOutputTypeCache.get(target)
  }
  const interf = interfaceTypeRegistry.get(config.implements)
  const compiled = new GraphQLObjectType({
    interfaces: [interf()],
    name: config.name,
    description: config.description,
    isTypeOf: (value: any) => value instanceof target,
    fields: createTypeFieldsGetter(target, config),
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
