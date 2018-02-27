import { GraphQLFieldResolver } from 'graphql';

export const InjectorsSymbol = Symbol('type.field.injectors');
export type InjectorResolver = GraphQLFieldResolver<any, any>;

export interface InjectorsIndex {
  [injectorIndex: number]: InjectorResolver;
}

declare global {
  interface Function {
    [InjectorsSymbol]: {
      [fieldName: string]: InjectorsIndex;
    };
  }
}

const injectorRegistry = new WeakMap<
  Function,
  {
    [fieldName: string]: InjectorsIndex;
  }
>();

export function registerInjector(
  targetClass: Function,
  fieldName: string,
  argIndex: number,
  resolver: InjectorResolver,
) {
  if (!injectorRegistry.has(targetClass)) {
    injectorRegistry.set(targetClass, { [fieldName]: { [argIndex]: resolver } });
  }
  const registry = injectorRegistry.get(targetClass);
  injectorRegistry.set(targetClass, {
    ...registry,
    [fieldName]: {
      ...registry[fieldName],
      [argIndex]: resolver,
    },
  });
}

export function hasInjectorRegistered(
  targetClass: Function,
  fieldName: string,
  argIndex: number,
) {
  return !!getInjectorResolver(targetClass, fieldName, argIndex);
}

export function getInjectorResolver(
  targetClass: Function,
  fieldName: string,
  argIndex: number,
) {
  if (!injectorRegistry.has(targetClass)) {
    return null;
  }
  const registry = injectorRegistry.get(targetClass);
  return registry && registry[fieldName] && registry[fieldName][argIndex];
}

export function getAllInjectors(targetClass: Function, fieldName: string) {
  const registry = injectorRegistry.get(targetClass);
  return registry && registry[fieldName];
}
