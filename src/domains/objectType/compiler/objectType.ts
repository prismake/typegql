import { GraphQLObjectType } from 'graphql'
import {
  ObjectTypeError,
  objectTypeRegistry,
  IObjectTypeOptions
} from '../index'

import { compileAllFields } from '../../field'
import {
  getClassWithAllParentClasses,
  createCachedThunk
} from '../../../services/utils'
import { interfaceTypeRegistry } from '../../interfaceType/interfaceTypeRegistry'

export const compileOutputTypeCache = new WeakMap<Function, GraphQLObjectType>()

export function createTypeFieldsGetter(
  target: Function,
  config?: IObjectTypeOptions
) {
  let targetWithParents = getClassWithAllParentClasses(target)
  if (config) {
    if (config.mixins) {
      targetWithParents = targetWithParents.concat(config.mixins)
    }
    if (config.implements) {
      targetWithParents = targetWithParents.concat(config.implements)
    }
  }

  return createCachedThunk(() => {
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
