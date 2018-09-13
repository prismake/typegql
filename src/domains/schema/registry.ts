import { GraphQLFieldConfig } from 'graphql';
import { DeepWeakMap } from '../../services/utils';

export type Getter<Result> = () => Result;

export interface SchemaRootConfig {}

export const schemaRootsRegistry = new WeakMap<Function, SchemaRootConfig>();

export type RootFieldsRegistry = DeepWeakMap<
  Function,
  Getter<GraphQLFieldConfig<any, any>>
>;

export const queryFieldsRegistry = new DeepWeakMap<
  Function,
  Getter<GraphQLFieldConfig<any, any>>
>();

export const mutationFieldsRegistry = new DeepWeakMap<
  Function,
  Getter<GraphQLFieldConfig<any, any>>
>();
