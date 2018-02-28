import { GraphQLObjectType } from 'graphql';

type Getter<Result> = () => Result;

export const queryRegistry = new WeakMap<Function, Getter<GraphQLObjectType>>();
export const mutationRegistry = new WeakMap<Function, Getter<GraphQLObjectType>>();
