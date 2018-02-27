// import { registerObjectType } from './registry';

export { compileType } from './compiler';
import { typeConfigRegistry } from './registry';
export { typeConfigRegistry } from './registry';
export { ObjectTypeError } from './error';

export const objectTypeSymbol = Symbol('objectType');

declare global {
  interface Function {
    [objectTypeSymbol]: any;
  }
}

export function Type(options?: any): ClassDecorator {
  return (target: Function) => {
    const { name } = target;
    typeConfigRegistry.set(target, { name, ...options });
  };
}
