import { GraphQLEnumType, GraphQLEnumValueConfigMap } from 'graphql';

export const enumsRegistry = new WeakMap<Object, GraphQLEnumType>();
