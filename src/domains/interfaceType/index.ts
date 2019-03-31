import { compileInterfaceTypeWithConfig } from './compiler';
import { interfaceTypeRegistry } from './registry';

export { compileInterfaceType } from './compiler';
export { InterfaceTypeError } from './error';
export { interfaceTypeRegistry } from './registry';

export interface InterfaceTypeOptions {
  name?: string;
  description?: string;
}

export function InterfaceType(options?: InterfaceTypeOptions): ClassDecorator {
  return (target: Function) => {
    const config = { name: target.name, ...options };
    const outputTypeCompiler = () =>
      compileInterfaceTypeWithConfig(target, config);
    interfaceTypeRegistry.set(target, outputTypeCompiler);
  };
}
