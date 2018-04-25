import { GraphQLSchema, GraphQLFieldConfig } from 'graphql';
import { DeepWeakMap } from 'services/utils';

type Getter<Result> = () => Result;

export const schemaRegistry = new WeakMap<Function, Getter<GraphQLSchema>>();

export type FieldRegistry = DeepWeakMap<Function, Getter<GraphQLFieldConfig<any, any>>>;

export const queryFieldsRegistry: FieldRegistry = new DeepWeakMap();
export const mutationFieldsRegistry: FieldRegistry = new DeepWeakMap();
