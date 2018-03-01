import { FieldInnerConfig, compileFieldConfig } from 'domains/field';
import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfig } from 'graphql';
import { DeepWeakMap } from 'services/utils';

type Getter<Result> = () => Result;

export const schemaRegistry = new WeakMap<Function, Getter<GraphQLSchema>>();

export const queryFieldsRegistry = new DeepWeakMap<
  Function,
  Getter<GraphQLFieldConfig<any, any>>
>();
export const mutationRegistry = new DeepWeakMap<Function, Getter<GraphQLObjectType>>();
