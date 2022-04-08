import { GraphQLInputObjectType } from 'graphql'
import { Constructor } from 'typescript-rtti'

type Getter<Result> = () => Result

export const inputObjectTypeRegistry = new WeakMap<
  Constructor<Function>,
  Getter<GraphQLInputObjectType>
>()

export interface ITypeConfig {
  name: string
  description: string
  isNonNull?: boolean
}
