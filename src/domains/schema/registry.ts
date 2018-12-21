import { GraphQLFieldConfig } from 'graphql'
import { DeepWeakMap } from '../../services/utils/deepWeakMap/DeepWeakMap'

export type Getter<Result> = () => Result

export const schemaRootsRegistry = new WeakMap<Function, object>()

export type RootFieldsRegistry = DeepWeakMap<
  Function,
  Getter<GraphQLFieldConfig<any, any>>
>

export const queryFieldsRegistry = new DeepWeakMap<
  Function,
  Getter<GraphQLFieldConfig<any, any>>
>()

export const mutationFieldsRegistry = new DeepWeakMap<
  Function,
  Getter<GraphQLFieldConfig<any, any>>
>()
