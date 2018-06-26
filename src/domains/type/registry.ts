// import { GraphQLInputType, GraphQLObjectType } from 'graphql';

// type Getter<Result> = () => Result;

export const objectTypeRegistry = new WeakMap<
  Function,
  TypeConfig
>();

export const inputTypeRegistry = new WeakMap<
  Function,
  TypeConfig
>();

export interface TypeConfig {
  name: string;
  description?: string;
}

export function registerType(target: Function, config: TypeConfig) {
  const finalConfig: TypeConfig = { name: target.name, ...config };
  objectTypeRegistry.set(target, finalConfig);
  inputTypeRegistry.set(target, finalConfig);
}
