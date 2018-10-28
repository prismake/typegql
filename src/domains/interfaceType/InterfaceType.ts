import { interfaceTypeRegistry } from './interfaceTypeRegistry'

// import { compileUnionType, UnionTypeResolver } from './compiler'
// import { Thunk } from '../../services/types'
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
  description?: string
}

export function InterfaceType(config?: InterfaceTypeOptions): ClassDecorator {
  return (target) => {
    interfaceTypeRegistry.set(target, () => {
      // return compileUnionType(target, { name: target.name, ...config })

      // const resolvedTypes = resolveTypesList(types)
      const name = config && config.name ? config.name : target.name

      console.log('name: ', name)
      const description = config ? config.description : null
      return new GraphQLInterfaceType({
        name,
        description,
        // resolveType: getDefaultResolver(resolvedTypes),
        fields: createTypeFieldsGetter(target),
      })
    })
  }
}
