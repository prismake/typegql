import { GraphQLUnionType } from 'graphql';

export const unionRegistry = new WeakMap<Function, () => GraphQLUnionType>();
