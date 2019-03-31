import { GraphQLObjectType } from 'graphql';

type Getter<Result> = () => Result;

export const objectTypeRegistry = new WeakMap<
  Function,
  Getter<GraphQLObjectType>
>();

export interface TypeConfig {
  name: string;
  description: string;
  isNonNull?: boolean;
}
