import { GraphQLObjectType } from 'graphql'
import {
  ObjectTypeError,
  objectTypeRegistry,
  IObjectTypeOptions
} from '../ObjectType'

import { compileAllFields } from '../../field/Field'

import { interfaceTypeRegistry } from '../../interfaceType/interfaceTypeRegistry'
import { createCachedThunk } from '../../../services/utils/cachedThunk'
import { getClassWithAllParentClasses } from '../../../services/utils/inheritance'

export const compileOutputTypeCache = new WeakMap<Function, GraphQLObjectType>()

export function createTypeFieldsGetter(
  target: Function,
  config?: IObjectTypeOptions
) {
  let targetWithParents = getClassWithAllParentClasses(target)
  const { mixins } = config

  if (config) {
    if (mixins) {
      if (Array.isArray(mixins)) {
        mixins.forEach((mixin, i) => {
          if (typeof mixin !== 'function') {
            throw new TypeError(
              `expected a mixin on ${
                target.name
              } to be a Class, instead value of index ${i} is ${mixin}`
            )
          }
        })
        targetWithParents = targetWithParents.concat(mixins)
      }
    }
    if (config.implements) {
      if (typeof config.implements !== 'function') {
        throw new TypeError(
          `expected an "implements" reference on ${
            target.name
          } to be a Class, instead value is ${config.implements}`
        )
      }

      targetWithParents = targetWithParents.concat(config.implements)
    }
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
  const interf = interfaceTypeRegistry.get(config.implements)

  const compiled = new GraphQLObjectType({
    interfaces: interf
      ? createCachedThunk(() => {
          return [interf()]
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
