import { GraphQLInterfaceType } from 'graphql'

type Getter<Result> = () => Result

export const interfaceTypeRegistry = new WeakMap<
  Function,
  Getter<GraphQLInterfaceType>
>()

export const interfaceTypeImplementors = new WeakMap<Function, Function[]>()
export const interfaceClassesSet: Set<Function> = new Set()

export interface TypeConfig {
  name: string
  description: string
  isNonNull?: boolean
}
