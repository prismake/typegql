import { compileObjectTypeWithConfig } from './compiler';
import { objectTypeRegistry } from './registry';

export { compileObjectType } from './compiler';
export { ObjectTypeError } from './error';
export { objectTypeRegistry, inputTypeRegistry } from './registry';

export interface ObjectTypeOptions {
  name?: string;
  description?: string;
}

export function ObjectType(options?: ObjectTypeOptions): ClassDecorator {
  return (target: Function) => {
    const config = { name: target.name, ...options };
    const outputTypeCompiler = () =>
      compileObjectTypeWithConfig(target, config);
    objectTypeRegistry.set(target, outputTypeCompiler);
  };
}
