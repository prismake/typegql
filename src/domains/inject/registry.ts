import { GraphQLResolveInfo } from 'graphql'
import { DeepWeakMap } from '../../services/utils/deepWeakMap/DeepWeakMap'

export interface InjectorResolverData {
  source: any
  args: { [key: string]: any }
  context: any
  info: GraphQLResolveInfo
}

export type InjectorResolver = (data: InjectorResolverData) => any

export interface InjectorsIndex {
  [injectorIndex: number]: InjectorResolver
}

export interface IAllInjectors {
  [fieldName: string]: InjectorsIndex
}

export const injectorRegistry = new DeepWeakMap<
  Function,
  InjectorResolver,
  IAllInjectors
>()
