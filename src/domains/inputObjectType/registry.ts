import { GraphQLInputObjectType } from 'graphql'

type Getter<Result> = () => Result

export const inputObjectTypeRegistry = new WeakMap<
  Function,
  Getter<GraphQLInputObjectType>
>()

export interface ITypeConfig {
  name: string
  description: string
  isNonNull?: boolean
}
