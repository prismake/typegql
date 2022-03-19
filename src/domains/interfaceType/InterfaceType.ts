import {
  interfaceTypeRegistry,
  interfaceClassesSet,
  interfaceTypeImplementors
} from './interfaceTypeRegistry'

import { GraphQLInterfaceType, GraphQLResolveInfo } from 'graphql'

import { compileAllFields } from '../field/Field'
import { createCachedThunk } from '../../services/utils/cachedThunk'
import { getClassWithAllParentClasses } from '../../services/utils/inheritance'
import { objectTypeRegistry } from '../objectType/registry'
import { Thunk } from '../../services/types'

export type ITypeResolver = (
  value: any,
  context: any,
  info: GraphQLResolveInfo
) => any

export interface ITypeOptions {
  name?: string
  description?: string
  mixins?: Function[] | Thunk<any>
}

const compileInterfaceCache = new WeakMap<Function, GraphQLInterfaceType>()

function getInterfaceResolveType(target: Function) {
  return (value: any) => {
    const implementors = interfaceTypeImplementors.get(target)
    if (Array.isArray(implementors)) {
      for (const implementor of implementors) {
        const typeGetterFromRegistry = objectTypeRegistry.get(implementor)
        if (
          Object.getPrototypeOf(value) === implementor.prototype &&
          typeGetterFromRegistry
        ) {
          const type = typeGetterFromRegistry()

          return type.name
        }
      }
    }
  }
}

function getFieldsGetter(target: Function, config?: ITypeOptions) {
  return createCachedThunk(() => {
    let targetWithParents = getClassWithAllParentClasses(target)
    if (config) {
      const { mixins } = config
      if (typeof mixins === 'function') {
        targetWithParents = targetWithParents.concat(mixins())
      } else if (Array.isArray(mixins)) {
        targetWithParents = targetWithParents.concat(mixins)
      }
    }
    return compileAllFields(targetWithParents)
  })
}

export function InterfaceType(config?: ITypeOptions): ClassDecorator {
  return (target) => {
    interfaceClassesSet.add(target)

    const typeGetter = () => {
      const intfcCache = compileInterfaceCache.get(target)

      if (intfcCache) {
        return intfcCache
      }

      const name = config && config.name ? config.name : target.name

      const description = config ? config.description : null
      const intfc = new GraphQLInterfaceType({
        name,
        description,

        resolveType: getInterfaceResolveType(target),
        fields: getFieldsGetter(target, config)
      })
      compileInterfaceCache.set(target, intfc)

      return intfc
    }

    interfaceTypeRegistry.set(target, typeGetter)
  }
}
