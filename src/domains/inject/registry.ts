import { GraphQLFieldResolver } from 'graphql';

import { DeepWeakMap } from 'services/utils';

export type InjectorResolver = GraphQLFieldResolver<any, any>;

export interface InjectorsIndex {
  [injectorIndex: number]: InjectorResolver;
}

export interface AllInjectors {
  [fieldName: string]: InjectorsIndex;
}

export const injectorRegistry = new DeepWeakMap<
  Function,
  InjectorResolver,
  AllInjectors
>();
