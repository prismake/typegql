import { fieldsRegistry, queryFieldsRegistry } from './registry';

export function isQueryField(target: Function, fieldName: string) {
  const fieldRegistered = fieldsRegistry.get(target, fieldName);
  const queryFieldRegistered = queryFieldsRegistry.get(target, fieldName);
  return fieldRegistered && fieldRegistered === queryFieldRegistered;
}
