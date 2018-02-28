import { GraphQLSchema, GraphQLObjectType } from 'graphql';

type Getter<Result> = () => Result;

export const schemaRegistry = new WeakMap<Function, Getter<GraphQLSchema>>();

export const queryRegistry = new WeakMap<Function, Getter<GraphQLObjectType>>();
export const mutationRegistry = new WeakMap<Function, Getter<GraphQLObjectType>>();
