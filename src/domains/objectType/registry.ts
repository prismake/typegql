import { GraphQLOutputType, GraphQLInputType, GraphQLObjectType } from 'graphql';
import { ObjectTypeError } from './error';

type Getter<Result> = () => Result;

export const objectTypeRegistry = new WeakMap<Function, Getter<GraphQLObjectType>>();
export const inputTypeRegistry = new WeakMap<Function, Getter<GraphQLInputType>>();

export interface TypeConfig {
  name: string;
  description: string;
  isNonNull?: boolean;
  isList?: boolean;
}
