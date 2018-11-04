import {
  interfaceTypeRegistry,
  interfaceTypeImplementors,
  interfaceTypeImplementorsSet
} from './interfaceTypeRegistry'

import {
  GraphQLInterfaceType,
  // GraphQLObjectType,
  GraphQLResolveInfo
} from 'graphql'
import { createTypeFieldsGetter } from '../objectType/compiler/objectType'

import { objectTypeRegistry } from '../objectType/ObjectType'

export interface InterfaceTypeResolver {
  (value: any, context: any, info: GraphQLResolveInfo): any
}

export interface InterfaceTypeOptions {
  name?: string
  description?: string
}

const compileInterfaceCache = new WeakMap<Function, GraphQLInterfaceType>()

export function InterfaceType(config?: InterfaceTypeOptions): ClassDecorator {
  return (target) => {
    const typeGetter = () => {
      if (compileInterfaceCache.has(target)) {
        return compileInterfaceCache.get(target)
      }

      const name = config && config.name ? config.name : target.name

      const implementors = interfaceTypeImplementors.get(target)

      implementors.forEach((impl) => {
        const implementor = objectTypeRegistry.get(impl)()
        interfaceTypeImplementorsSet.add(implementor)
      })
      const description = config ? config.description : null
      const intfc = new GraphQLInterfaceType({
        name,
        description,
        fields: createTypeFieldsGetter(target)
      })
      compileInterfaceCache.set(target, intfc)

      return intfc
    }

    interfaceTypeRegistry.set(target, typeGetter)
  }
}
