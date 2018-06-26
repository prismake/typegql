import { registerType } from './registry';

export { objectTypeRegistry, inputTypeRegistry, registerType } from './registry';
export { ObjectTypeError } from './error'

export interface ObjectTypeOptions {
  name?: string;
  description?: string;
}

export function ObjectType(options?: ObjectTypeOptions): ClassDecorator {
  return (target: Function) => {
    const config = { name: target.name, ...options };
    registerType(target, config);
  };
}
