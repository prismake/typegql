import { ResolvableType } from 'services/utils';
import { FieldError } from './error';

export const fieldRegistry = new WeakMap<
  Function,
  {
    [fieldName: string]: FieldConfig;
  }
>();

export interface FieldConfig {
  name: string;
  property: string;
  description?: string;
  type?: ResolvableType;
}

export function registerField(target: Function, fieldName: string, options: FieldConfig) {
  if (hasFieldRegistered(target, fieldName)) {
    throw new FieldError(target, fieldName, `Cannot register the same field twice`);
  }
  if (!fieldRegistry.has(target)) {
    fieldRegistry.set(target, { [fieldName]: options });
  }
  fieldRegistry.set(target, {
    ...fieldRegistry.get(target),
    [fieldName]: options,
  });
}

export function hasFieldRegistered(targetClass: Function, fieldName: string) {
  return fieldRegistry.has(targetClass) && !!fieldRegistry.get(targetClass)[fieldName];
}

export function getRegisteredField(targetClass: Function, fieldName: string) {
  return (
    hasFieldRegistered(targetClass, fieldName) &&
    fieldRegistry.get(targetClass)[fieldName]
  );
}

export function getAllRegisteredFields(targetClass: Function) {
  return fieldRegistry.get(targetClass);
}
