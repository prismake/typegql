import { interfaceTypeRegistry } from './interfaceTypeRegistry'

// import { compileUnionType, UnionTypeResolver } from './compiler'
import { Thunk } from '../../services/types'
import {
  GraphQLInterfaceType,
  // GraphQLObjectType,
  GraphQLResolveInfo,
} from 'graphql'
import { createTypeFieldsGetter } from '../objectType/compiler/objectType'
// import { resolveTypesList } from '../../services/utils'

export interface InterfaceTypeResolver {
  (value: any, context: any, info: GraphQLResolveInfo): any
}

export interface InterfaceTypeOptions {
  name?: string
  // resolveTypes?: UnionTypeResolver
  types: Thunk<any[]>
}

// function getDefaultResolver(types: GraphQLObjectType[]): InterfaceTypeResolver {
//   return (value: any, context: any, info: any) => {
//     for (let type of types) {
//       if (type.isTypeOf && type.isTypeOf(value, context, info)) {
//         return type
//       }
//     }
//   }
// }

export interface InterfaceTypeOptions {
  name?: string
}

export function InterfaceType(config?: InterfaceTypeOptions): ClassDecorator {
  return (target) => {
    interfaceTypeRegistry.set(target, () => {
      // return compileUnionType(target, { name: target.name, ...config })

      // const { types } = config

      // const resolvedTypes = resolveTypesList(types)

      return new GraphQLInterfaceType({
        name: target.name,
        // resolveType: getDefaultResolver(resolvedTypes),
        fields: createTypeFieldsGetter(target),
      })
    })
  }
}
