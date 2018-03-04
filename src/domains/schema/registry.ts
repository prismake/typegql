import { GraphQLSchema, GraphQLFieldConfig } from 'graphql';
import { DeepWeakMap } from 'services/utils';

type Getter<Result> = () => Result;

export const schemaRegistry = new WeakMap<Function, Getter<GraphQLSchema>>();

export const queryFieldsRegistry = new DeepWeakMap<
  Function,
  Getter<GraphQLFieldConfig<any, any>>
>();

export const mutationFieldsRegistry = new DeepWeakMap<
  Function,
  Getter<GraphQLFieldConfig<any, any>>
>();
