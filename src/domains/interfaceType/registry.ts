import { GraphQLInterfaceType, GraphQLTypeResolver } from 'graphql';

type Getter<Result> = () => Result;

export const interfaceTypeRegistry = new WeakMap<
  Function,
  Getter<GraphQLInterfaceType>
>();

export interface TypeConfig {
  name: string;
  description: string;
  resolveType: GraphQLTypeResolver<any, any> | void;
}
