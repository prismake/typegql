import { GraphQLResolveInfo } from 'graphql';

import { DeepWeakMap } from '~/services/utils';

export interface InjectorResolverData {
  source: any;
  args: { [key: string]: any };
  context: any;
  info: GraphQLResolveInfo;
}

export type InjectorResolver = (data: InjectorResolverData) => any;

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
