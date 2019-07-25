import { GraphQLObjectType, GraphQLInterfaceType } from 'graphql'
import {
  ObjectTypeError,
  objectTypeRegistry,
  IObjectTypeOptions
} from '../ObjectType'

import { compileAllFields } from '../../field/Field'

import { interfaceTypeRegistry } from '../../interfaceType/interfaceTypeRegistry'
import { createCachedThunk } from '../../../services/utils/cachedThunk'
import { getClassWithAllParentClasses } from '../../../services/utils/inheritance'
import { Getter } from '../../../domains/schema/registry'

export const compileOutputTypeCache = new WeakMap<Function, GraphQLObjectType>()

export function createTypeFieldsGetter(
  target: Function,
  config: IObjectTypeOptions
) {
  let targetWithParents = getClassWithAllParentClasses(target)
  const { mixins } = config

  if (mixins && Array.isArray(mixins)) {
    mixins.forEach((mixin, i) => {
      if (typeof mixin !== 'function') {
        throw new TypeError(
          `expected a mixin on ${target.name} to be a Class, instead value of index ${i} is ${mixin}`
        )
      }
    })
    targetWithParents = targetWithParents.concat(mixins)
  }

  if (config.implements) {
    config.implements.forEach((interfaceClass) => {
      if (typeof interfaceClass !== 'function') {
        throw new TypeError(
          `expected an "implements" reference on ${target.name} to be a Class, instead value is ${config.implements}`
        )
      }
    })

    targetWithParents = targetWithParents.concat(config.implements)
  }

  return createCachedThunk(() => {
    if (typeof mixins === 'function') {
      targetWithParents = targetWithParents.concat(mixins())
    }

    return compileAllFields(targetWithParents)
  })
}

export function compileObjectTypeWithConfig(
  target: Function,
  config: IObjectTypeOptions
): GraphQLObjectType {
  if (compileOutputTypeCache.has(target)) {
    return compileOutputTypeCache.get(target)
  }
  let interfaces: Array<Getter<GraphQLInterfaceType>> = null
  if (config.implements) {
    interfaces = config.implements.map((interfaceClass) => {
      return interfaceTypeRegistry.get(interfaceClass)
    })
  }

  const compiled = new GraphQLObjectType({
    interfaces: interfaces
      ? createCachedThunk(() => {
          return interfaces.map((intf) => intf())
        })
      : null,
    name: config.name,
    description: config.description,
    isTypeOf: (value: any) => value instanceof target,
    fields: createTypeFieldsGetter(target, config)
  })

  compileOutputTypeCache.set(target, compiled)
  return compiled
}

export function compileObjectType(target: Function) {
  if (!objectTypeRegistry.has(target)) {
    throw new ObjectTypeError(
      target,
      `Class is not registered. Make sure it's decorated with @ObjectType decorator`
    )
  }

  const compiler = objectTypeRegistry.get(target)
  return compiler()
}
