import { GraphQLInterfaceType, GraphQLObjectType } from 'graphql'

type Getter<Result> = () => Result

export const interfaceTypeRegistry = new WeakMap<
  Function,
  Getter<GraphQLInterfaceType>
>()

export const interfaceTypeImplementors = new WeakMap<Function, Function[]>()
export const interfaceTypeImplementorsSet: Set<GraphQLObjectType> = new Set()

export interface TypeConfig {
  name: string
  description: string
  isNonNull?: boolean
}
