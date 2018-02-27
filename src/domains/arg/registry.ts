import { ResolvableType } from 'services/utils';

export interface ArgConfig {
  description?: string;
  type?: ResolvableType;
}

const argRegistry = new WeakMap<
  Function,
  {
    [fieldName: string]: ArgsIndex;
  }
>();

export interface ArgsIndex {
  [argIndex: number]: ArgConfig;
}

export function registerArg(
  targetClass: Function,
  fieldName: string,
  argIndex: number,
  options: ArgConfig,
) {
  if (!argRegistry.has(targetClass)) {
    argRegistry.set(targetClass, { [fieldName]: { [argIndex]: options } });
  }
  const registry = argRegistry.get(targetClass);
  argRegistry.set(targetClass, {
    ...registry,
    [fieldName]: {
      ...registry[fieldName],
      [argIndex]: options,
    },
  });
}

export function hasArgRegistered(
  targetClass: Function,
  fieldName: string,
  argIndex: number,
) {
  return !!getArgConfig(targetClass, fieldName, argIndex);
}

export function getArgConfig(targetClass: Function, fieldName: string, argIndex: number) {
  if (!argRegistry.has(targetClass)) {
    return null;
  }
  const registry = argRegistry.get(targetClass);
  return registry && registry[fieldName] && registry[fieldName][argIndex];
}

export function getAllArgs(targetClass: Function, fieldName: string) {
  const registry = argRegistry.get(targetClass);
  return registry && registry[fieldName];
}
